import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { differenceInMinutes, parseISO } from 'date-fns';
import { Knex } from 'knex';
import { chain, uniq } from 'lodash';
import { KNEX_CONNECTION } from 'src/common/constants';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { StoreOrderEntity } from 'src/store-confirmation/dto/store-order.entity';
import { StoreConfirmationGateway } from '../store-confirmation/store-confirmation.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetailItemDto } from './dto/order-detail-item.dto';
import { OrderDetailModDto } from './dto/order-detail-mod.dto';
import { OrderItemDataEntity } from './entities/orderItemData.entity';
import {
  ModgroupS,
  OrderModgroupDataEntity,
} from './entities/orderModgroupData.entity';
import { OrderModOptDataEntity } from './entities/orderModOptData.entity';
import { ItemError } from './errors/itemError';
import { ModError } from './errors/modError';
import { OrderError } from './errors/orderError';
import { OrderItemDataDict } from './order-item-data-dict.interface';
import { OrderModoptDataDictByItemId } from './order-modopt-data-dict.interface';

@Injectable()
export class OrderService {
  constructor(
    private ctx: PrismaContext,
    @Inject(KNEX_CONNECTION) private knex: Knex,
    private storeGateway: StoreConfirmationGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    let {
      orderErr,
      itemDataDictByItemId,
      modData,
      modOptData,
    }: {
      orderErr: OrderError;
      itemDataDictByItemId: OrderItemDataDict;
      modData: OrderModgroupDataEntity;
      modOptData: OrderModOptDataEntity[];
    } = await this.validate(createOrderDto);

    if (orderErr.orderErr.length > 0 || orderErr.itemErrors.length > 0) {
      console.log(orderErr.orderErr);
      console.log(`${JSON.stringify(orderErr.itemErrors)}`);
      throw new BadRequestException('Invalid order');
    }

    // charge credit card

    // save info into db

    // return receipt
    // let oid = await this.knex<Order>('order').insert(createOrderDto).returning('oid').first()
    // return oid

    let storeOrderEntity = new StoreOrderEntity(
      createOrderDto,
      itemDataDictByItemId,
      modData,
      modOptData,
      'abc',
    );

    await this.storeGateway.notifyOfNewOrder(storeOrderEntity);

    return this.ctx.prisma.order.create({
      data: storeOrderEntity,
      select: {
        oid: true,
      },
    });
  }

  private async validate(createOrderDto: CreateOrderDto) {
    let orderErr = new OrderError();

    let { items: requestedItems } = createOrderDto.details;

    let requestedItemIds = uniq(requestedItems.map((x) => x.id));

    let requestedModIds = chain(
      requestedItems
        .map((orderDetailItem) =>
          orderDetailItem.mods?.map((orderDetailMod) => orderDetailMod.id),
        )
        .filter((mods): mods is number[] => !!mods),
    )
      .flatten()
      .uniq()
      .value();

    console.log(requestedModIds);

    // get item and moditems
    let itemData = await this.knex
      .select<any, OrderItemDataEntity[]>([
        'i.item_id',
        'i.name as item_name',
        this.knex.raw('i.price::numeric as item_price'),
        'i.active as item_active',
        this.knex.raw('array_agg(ixm.mod_id) as mods'),
      ])
      .from('item as i')
      .join('item_X_modgroup as ixm', 'i.item_id', 'ixm.item_id')
      .where('i.is_standalone', true)
      .orderBy('i.item_id')
      .groupBy('i.item_id')
      .whereIn('i.item_id', requestedItemIds);
    // console.log(itemData)
    let itemDataDictByItemId: OrderItemDataDict = itemData.reduce(
      (acc, val) => ({
        ...acc,
        [val.item_id]: val,
      }),
      {},
    );
    // console.log(itemDataDictByItemId);
    // todo: review remove properties that are duplicated by modDataRaw
    let modOptData: OrderModOptDataEntity[] = await this.knex
      .select<any, OrderModOptDataEntity[]>([
        'mi.mod_id',
        'mi.item_id',
        'mi.price as modopt_price',
        'i.name as modopt_name',
        'i.price as item_price',
        'i.active as item_active',
        'm2.name as mod_name',
        'm2.required_selection',
        'm2.max_selection',
        'm2.max_single_select',
        'm2.free_selection',
        'm2.price as mod_price',
        'm2.description',
      ])
      .from('modgroup_item as mi')
      .join('item as i', 'i.item_id', 'mi.item_id')
      .join('modgroup as m2', 'm2.mod_id', 'mi.mod_id')
      .whereIn('m2.mod_id', requestedModIds);

    let modDataRaw = await this.knex<ModgroupS>('modgroup')
      .select('*')
      .whereIn('mod_id', requestedModIds);

    let modData: OrderModgroupDataEntity = {};
    // (await this.knex<modgroupS>('modgroup').select('*').whereIn('mod_id', requestedModIds)).forEach(modgroup => {
    //   modData[modgroup.mod_id!] = modgroup
    // })
    modDataRaw.forEach((modgroup) => {
      modData[modgroup.mod_id!] = modgroup;
    });

    // match input id, price to db AND check availability
    let { totalCostOfAllMods, totalPrice } = this.validateItems(
      requestedItems,
      itemDataDictByItemId,
      orderErr,
      modData,
      modOptData,
    );

    // verify total price correct
    if (
      totalPrice !==
      Number(createOrderDto.amount_paid) - Number(createOrderDto.tax)
    ) {
      console.log(
        `pretax total price incorrect: expected ${totalPrice} but recieved ${
          Number(createOrderDto.amount_paid) - Number(createOrderDto.tax)
        }`,
      );
      orderErr.orderErr.push('total price mismatch');
    }

    // verify tax amount
    // verify valid pickup time
    let pickupTime =
      typeof createOrderDto.pickup_time === 'string'
        ? parseISO(createOrderDto.pickup_time)
        : createOrderDto.pickup_time;

    console.log(pickupTime);
    console.log(new Date());
    // pickup time must be future or "NOW" ie within 60s of current time
    if (differenceInMinutes(pickupTime, Date.now()) <= -1) {
      console.log(
        `pickup_time is more than a minute ago from the current time`,
      );
      orderErr.orderErr.push('pickup_time too far in the past');
    }
    return { orderErr, itemDataDictByItemId, modData, modOptData };
  }

  /**
   *
   * @param requestedItems
   * @param itemDataDictByItemId
   * @param orderErr Mutable; Encountered errors are stored here
   * @param modData
   * @param modOptData
   * @returns totalPrice
   *
   * <tbd> totalCostOfAllMods
   */
  private validateItems(
    requestedItems: OrderDetailItemDto[],
    itemDataDictByItemId: OrderItemDataDict,
    orderErr: OrderError,
    modData: OrderModgroupDataEntity,
    modOptData: OrderModOptDataEntity[],
  ): { totalCostOfAllMods: number; totalPrice: number } {
    let totalCostOfAllMods: number = 0;
    let totalPrice: number = 0;
    requestedItems.forEach((requestedItem, index) => {
      let itemPriceWithMods = 0;
      let itemAvailable = false;

      // check the item id is available
      if (!itemDataDictByItemId[requestedItem.id]?.item_active) {
        orderErr.itemErrors.push(
          new ItemError(index, requestedItem.id, requestedItem.name, [
            'item not available',
          ]),
        );
        console.log('item not available');
        return;
      }

      // check item price is correct
      if (
        Number(itemDataDictByItemId[requestedItem.id].item_price) !==
        requestedItem.price
      ) {
        console.log(
          `expected ${requestedItem.price} but got ${Number(
            itemDataDictByItemId[requestedItem.id].item_price,
          )}`,
        );
        orderErr.itemErrors.push(
          new ItemError(index, requestedItem.id, requestedItem.name, [
            'item price mismatch',
          ]),
        );
        return;
      }

      // ignore checking item name

      // check that the requested item can have the requested modgroups
      let requestedMods = requestedItem.mods;
      if (requestedMods === undefined || requestedMods.length < 1) {
        // skip mod price calculation
        itemPriceWithMods = Number(
          itemDataDictByItemId[requestedItem.id]?.item_price,
        );
        totalPrice += itemPriceWithMods * requestedItem.quantity;
        return;
      }

      // check that no duplicate modgroups for this item ie mods = [{ id: 1, modifierItemIds: [10] }, { id: 1, modifierItemIds: [10] }]
      let modgroupIdMap = new Map();
      requestedMods
        .map((e) => e.id)
        .forEach((id) => {
          if (modgroupIdMap.has(id)) {
            orderErr.itemErrors.push(
              new ItemError(index, requestedItem.id, requestedItem.name, [
                'duplicate modgroup detected for item',
              ]),
            );
            console.log(
              `duplicate modgroup ${id} in order @ item#${index} item_id:${requestedItem.id}`,
            );
          } else {
            modgroupIdMap.set(id, true);
          }
        });

      let requestedModsAreValid = requestedMods.every((requestedMod) =>
        itemDataDictByItemId[requestedItem.id].mods.includes(requestedMod.id),
      );
      if (!requestedModsAreValid) {
        // console.log(`invalid modgroup for item ${requestedItem.name}`);
        orderErr.itemErrors.push(
          new ItemError(index, requestedItem.id, requestedItem.name, [
            'one or more item modifiers not available',
          ]),
        );
        return;
      }
      // console.log(`validmodgrup is ${requestedModsAreValid}`);

      // check that the requested modgroups have the requested modopts
      let { modsCostForItem, modErrors } = checkRequestedMods(
        requestedMods,
        modData,
        modOptData,
        itemDataDictByItemId,
      );

      if (modErrors.length > 0) {
        orderErr.itemErrors.push(
          new ItemError(
            index,
            requestedItem.id,
            requestedItem.name,
            [],
            modErrors,
          ),
        );
        return;
      }
      console.log(modsCostForItem);
      totalCostOfAllMods += modsCostForItem;
      itemPriceWithMods =
        Number(itemDataDictByItemId[requestedItem.id]?.item_price) +
        modsCostForItem;
      totalPrice += itemPriceWithMods * requestedItem.quantity;
    });
    return { totalCostOfAllMods, totalPrice };
  }

  async findAll() {
    return this.ctx.prisma.order.findMany();
  }

  async findOne(id: number) {
    return this.ctx.prisma.order.findUnique({
      where: {
        oid: id,
      },
    });
  }

  async update(id: number, updateOrderDto: Prisma.orderUpdateInput) {
    return this.ctx.prisma.order.update({
      where: {
        oid: id,
      },
      data: updateOrderDto,
    });
  }

  async remove(id: number) {
    return this.ctx.prisma.order.delete({
      where: {
        oid: id,
      },
    });
  }
}

/**
 *
 * @param requestedMods
 * @param modgroupData
 * @param modOptData
 * @param itemDataDictByItemId
 * @returns
 * modsCostForItem = total cost of all modgroups for this item
 *
 * modErrors = any modgroup/modoption errors for this item
 */
function checkRequestedMods(
  requestedMods: OrderDetailModDto[],
  modgroupData: OrderModgroupDataEntity,
  modOptData: OrderModOptDataEntity[],
  itemDataDictByItemId: OrderItemDataDict,
): { modsCostForItem: number; modErrors: ModError[] } {
  let modsCostForItem: number = 0;

  if (!requestedMods || requestedMods.length === 0) {
    return { modsCostForItem, modErrors: [] };
  }

  let modToModOptMap: { [modgroupId: number]: number[] } = {};
  modOptData.forEach((row) => {
    if (modToModOptMap[row.mod_id]) {
      modToModOptMap[row.mod_id].push(row.item_id);
    } else {
      modToModOptMap[row.mod_id] = [row.item_id];
    }
  });
  let modError: ModError;
  let modErrors: ModError[] = [];

  requestedMods.forEach((requestedMod, index) => {
    let requestedModId = requestedMod.id;
    let requestedModifierItemIds = requestedMod.modifierItemIds;
    let costOfModifier = 0;
    modError = new ModError(requestedMod.id, modgroupData[requestedModId].name);

    let modifierOptionByItemId: { [item_id: number]: OrderModOptDataEntity } =
      modOptData.reduce(
        (acc, val) => ({
          ...acc,
          [val.item_id]: val,
        }),
        {},
      );

    let validModOpts = requestedModifierItemIds.every(
      (requestedModOpt) =>
        modToModOptMap[requestedModId].includes(requestedModOpt) &&
        modifierOptionByItemId[requestedModOpt].item_active,
    );

    if (!validModOpts) {
      console.log(`invalid modoption for mod`);
      modError.modErr.push(
        `invalid modifier option for ${modgroupData[requestedModId].name} encountered`,
      );
    }

    // check that the requested modopts meets the requirements
    // get requirements for this modgroup
    let reqs = modgroupData[requestedModId];

    // total modopt count must be at least required_selection
    if (requestedModifierItemIds.length < reqs.required_selection) {
      console.log(
        `recieved ${requestedModifierItemIds.length} but expected at least ${reqs.required_selection} selection(s)`,
      );
      modError.modErr.push(
        `${modgroupData[requestedModId].name} requires at least ${reqs.required_selection} selection(s)`,
      );
    }
    // total modopt count must be less than max_selection
    if (requestedModifierItemIds.length > reqs.max_selection) {
      console.log(
        `recieved ${requestedModifierItemIds.length} but expected at most ${reqs.max_selection} selection(s)`,
      );
      modError.modErr.push(
        `${modgroupData[requestedModId].name} can only have a max of ${reqs.max_selection} selection(s)`,
      );
    }

    let modOptCount = chain(requestedModifierItemIds).countBy().value();
    let modOptCosts: number[] = [];
    Object.keys(modOptCount).forEach((key) => {
      // no single modopt can be more than max_single_selection
      if (modOptCount[key] > reqs.max_single_select) {
        console.log(
          `recieved ${modOptCount[key]}x ${key} but the limit is ${reqs.max_single_select}`,
        );
        modError.modErr.push(
          `For ${modgroupData[requestedModId].name}, you can only have at most ${reqs.max_single_select} of the same selection`,
        );
      }

      // get prices of mod options
      let singleModOptCost =
        modOptData.find(
          (data) =>
            data.mod_id === requestedModId && data.item_id === Number(key),
        )?.modopt_price ??
        modgroupData[requestedModId].price ??
        itemDataDictByItemId[key].item_price;

      for (let i = 0; i < modOptCount[key]; i++) {
        modOptCosts.push(Number(singleModOptCost));
      }
    });

    if (modError.modErr.length > 0) {
      modErrors.push(modError);
    }

    // sort by low to high
    modOptCosts.sort((a, b) => a - b);
    // remove # of free_selections
    for (let i = 0; i < reqs.free_selection; i++) {
      modOptCosts.shift();
    }

    costOfModifier += modOptCosts.reduce((a, b) => a + b, 0);
    modsCostForItem += costOfModifier;
  });
  return { modsCostForItem, modErrors };
}
