import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { differenceInMinutes, parseISO } from 'date-fns';
import { Knex } from 'knex';
import { chain, uniq } from 'lodash';
import { KNEX_CONNECTION } from 'src/common/constants';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { StoreOrderEntity } from 'src/store-confirmation/dto/store-order.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { StoreConfirmationGateway } from '../store-confirmation/store-confirmation.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetailItemDto } from './dto/order-detail-item.dto';
import { OrderDetailModDto } from './dto/order-detail-mod.dto';
import { OrderItemDataEntity } from './entities/orderItemData.entity';
import { OrderModOptDataEntity } from './entities/orderModOptData.entity';
import {
  ModgroupS,
  OrderModgroupDataEntity,
} from './entities/orderModgroupData.entity';
import { ItemError } from './errors/itemError';
import { ModError } from './errors/modError';
import { OrderError } from './errors/orderError';
import { OrderItemDataDict } from './order-item-data-dict.interface';
import { OrderModoptDataByItemId } from './order-modopt-data-by-item-id.interface';

type TRecordKey = string | number;
type TIndexable = {
  [key: TRecordKey]: any;
};

@Injectable()
export class OrderService {
  constructor(
    private ctx: PrismaContext,
    @Inject(KNEX_CONNECTION) private knex: Knex,
    private storeGateway: StoreConfirmationGateway,
    private stripeService: StripeService,
  ) {}

  static createMappingByKey<T extends Record<string | number, any>>(
    data: T[],
    k: keyof T,
  ) {
    let x = data.reduce(
      (acc, val) => ({
        ...acc,
        [val[k]]: val,
      }),
      {} as Record<string | number, T>,
    );
    return x;
  }

  async create(createOrderDto: CreateOrderDto) {
    let { orderErr, itemDataByItemId, modData, modOptData } =
      await this.validateOrder(createOrderDto);

    if (orderErr.orderErr.length > 0 || orderErr.itemErrors.length > 0) {
      console.log(orderErr.orderErr);
      console.log(`${JSON.stringify(orderErr.itemErrors)}`);
      throw new BadRequestException('Invalid order');
    }

    let optionDataByItemId: OrderModoptDataByItemId = modOptData.reduce(
      (acc, val) => ({
        ...acc,
        [val.item_id]: val,
      }),
      {},
    );

    let session = await this.stripeService.createSession(
      createOrderDto,
      optionDataByItemId,
    );
    if (!session.payment_intent) {
      throw new ServiceUnavailableException();
    }

    let storeOrderEntity = new StoreOrderEntity(
      createOrderDto,
      itemDataByItemId,
      modData,
      modOptData,
      String(session.payment_intent),
    );

    await this.storeGateway.notifyOfNewOrder(storeOrderEntity);

    let { oid } = await this.ctx.prisma.order.create({
      data: storeOrderEntity,
      select: {
        oid: true,
      },
    });

    return { url: session.url! };
  }

  /**
   *
   * @param createOrderDto
   * @returns
   */
  private async validateOrder(createOrderDto: CreateOrderDto) {
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

    // currently gets items only, not moditems

    let itemData: OrderItemDataEntity[];
    try {
      itemData = await this.getItemData(requestedItemIds);
    } catch (error) {
      console.log(`unable to fetch itemData: ${error}`);
      throw error;
    }
    // console.log(itemData)
    let itemDataByItemId: OrderItemDataDict = OrderService.createMappingByKey(
      itemData,
      'item_id',
    );

    // console.log(itemDataDictByItemId);
    // todo: review remove properties that are duplicated by modDataRaw
    let optionData: OrderModOptDataEntity[] = [];

    try {
      optionData = await this.getOptionData(requestedModIds);
    } catch (error) {
      console.log(error);
    }
    console.log(optionData);

    let modData = await this.knex<ModgroupS>('modgroup')
      .select('*')
      .whereIn('mod_id', requestedModIds);

    let modDataByModId: OrderModgroupDataEntity =
      OrderService.createMappingByKey(modData, 'mod_id');
    // match input id, price to db AND check availability
    this.validateItems(
      requestedItems,
      itemDataByItemId,
      orderErr,
      modDataByModId,
      optionData,
    );
    if (orderErr.itemErrors.length > 0)
      return {
        orderErr,
        itemDataByItemId,
        modData: modDataByModId,
        modOptData: optionData,
      };

    let totalPrice = 0;
    // get pricing data structure
    totalPrice = this.calculateTotalPrice(
      requestedItems,
      modDataByModId,
      optionData,
      itemDataByItemId,
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

    // todo: verify tax amount
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
    return {
      orderErr,
      itemDataByItemId,
      modData: modDataByModId,
      modOptData: optionData,
    };
  }

  private calculateTotalPrice(
    requestedItems: OrderDetailItemDto[],
    modDataByModId: OrderModgroupDataEntity,
    modOptData: OrderModOptDataEntity[],
    itemDataByItemId: OrderItemDataDict,
  ) {
    let totalPrice = 0;
    // eslint-disable-next-line consistent-return
    requestedItems.forEach((requestedItem) => {
      let requestedMods = requestedItem.mods;
      if (requestedMods === undefined) return 0;
      let pricingData = extractPricingDataOfModifiersAndOptions(
        requestedItem.id,
        requestedMods,
        modDataByModId,
        modOptData,
        itemDataByItemId,
      );
      let itemPrice = 0;

      pricingData.forEach((modPriceData) => {
        let { modifier, options, price: basePriceOfMod } = modPriceData;
        let modprice = basePriceOfMod;

        let freeSelectionForMod = modDataByModId[modifier].free_selection;

        // sort high to low, apply free selections to highest cost options first
        options.sort((a, b) => b.price - a.price);
        options.forEach((optionData) => {
          let { option, quantity, price: optionPrice } = optionData;
          if (freeSelectionForMod > 0) {
            freeSelectionForMod -= 1;
          } else {
            modprice += optionPrice * quantity;
          }
        });
        itemPrice += modprice;
      });
      itemPrice += requestedItem.price;
      totalPrice += itemPrice * requestedItem.quantity;
    });
    return totalPrice;
  }

  private async getOptionData(
    requestedModIds: number[],
  ): Promise<OrderModOptDataEntity[]> {
    return this.knex
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
  }

  private async getItemData(requestedItemIds: number[]) {
    return this.knex
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
  }

  /**
   *
   * @param requestedItems
   * @param itemDataByItemId
   * @param orderErr Mutable; Encountered errors are stored here
   * @param modDataByModId
   * @param optionData
   */
  validateItems(
    requestedItems: OrderDetailItemDto[],
    itemDataByItemId: OrderItemDataDict,
    orderErr: OrderError,
    modDataByModId: OrderModgroupDataEntity,
    optionData: OrderModOptDataEntity[],
  ) {
    requestedItems.forEach((requestedItem, indexOfRequestedItem) => {
      let itemData = itemDataByItemId[requestedItem.id];

      // check the item id is available
      if (!itemData?.item_active) {
        orderErr.itemErrors.push(
          new ItemError(
            indexOfRequestedItem,
            requestedItem.id,
            requestedItem.name,
            ['item not available'],
          ),
        );
        console.log('item not available');
        return;
      }

      // check item price is correct
      if (!itemPriceIsValid(itemData, requestedItem)) {
        orderErr.itemErrors.push(
          new ItemError(
            indexOfRequestedItem,
            requestedItem.id,
            requestedItem.name,
            ['item price mismatch'],
          ),
        );
        return;
      }

      // todo: checking item name

      // check that the requested item can have the requested modgroups
      let requestedMods = requestedItem.mods;

      if (requestedMods === undefined || requestedMods.length < 1) {
        return;
      }

      this.validateModifiers(
        requestedMods,
        indexOfRequestedItem,
        requestedItem,
        orderErr,
        itemData,
      );
      this.validateOptions(
        requestedMods,
        modDataByModId,
        optionData,
        orderErr,
        indexOfRequestedItem,
        requestedItem,
      );
    });
  }

  private validateModifiers(
    requestedMods: OrderDetailModDto[],
    indexOfRequestedItem: number,
    requestedItem: OrderDetailItemDto,
    orderErr: OrderError,
    itemData: OrderItemDataEntity,
  ) {
    // check that no duplicate modgroups for this item ie mods = [{ id: 1, modifierItemIds: [10] }, { id: 1, modifierItemIds: [10] }]
    // ie dont allow for pancake: [select topping, select topping] b/c it may contradict
    let { hasDuplicateModifiers, errors } = this.checkItemForDuplicateModifiers(
      requestedMods,
      indexOfRequestedItem,
      requestedItem,
    );
    if (hasDuplicateModifiers) {
      errors.forEach((err) => {
        orderErr.itemErrors.push(err);
      });
      return;
    }

    let requestedModsValidForItem = requestedMods.every((requestedMod) =>
      itemData.mods.includes(requestedMod.id),
    );

    if (!requestedModsValidForItem) {
      // console.log(`invalid modgroup for item ${requestedItem.name}`);
      orderErr.itemErrors.push(
        new ItemError(
          indexOfRequestedItem,
          requestedItem.id,
          requestedItem.name,
          ['one or more selected item modifiers not available'],
        ),
      );
    }
  }

  private validateOptions(
    requestedMods: OrderDetailModDto[],
    modDataByModId: OrderModgroupDataEntity,
    optionData: OrderModOptDataEntity[],
    orderErr: OrderError,
    indexOfRequestedItem: number,
    requestedItem: OrderDetailItemDto,
  ) {
    let modErrors: ModError[] = [];
    let { result: hasValidOptionsForRequestedMods, errors: err } =
      checkOptionsExistOnModifiers(requestedMods, modDataByModId);
    if (!hasValidOptionsForRequestedMods) {
      modErrors = [...err];
    }

    // check options active
    let { result: optionsAreActive, errors: err3 } = checkOptionsActive(
      requestedMods,
      modDataByModId,
      optionData,
    );
    if (!optionsAreActive) {
      modErrors.push(...err3);
    }

    // CHECK REQUESTED OPTIONS FULFILL OPTION CONSTRAINTS
    let { result: optionConstraintsMet, errors: optionConstraintErrors } =
      checkRequestedOptionConstraints(requestedMods, modDataByModId);
    if (!optionConstraintsMet) {
      modErrors.push(...optionConstraintErrors);
    }

    if (modErrors.length > 0) {
      orderErr.itemErrors.push(
        new ItemError(
          indexOfRequestedItem,
          requestedItem.id,
          requestedItem.name,
          [],
          modErrors,
        ),
      );
    }
  }

  private checkItemForDuplicateModifiers(
    requestedMods: OrderDetailModDto[],
    indexOfRequestedItem: number,
    requestedItem: OrderDetailItemDto,
  ) {
    let requestedModIds = new Set<number>();
    let itemErrors: ItemError[] = [];
    requestedMods
      .map((e) => e.id)
      .forEach((id) => {
        if (requestedModIds.has(id)) {
          itemErrors.push(
            new ItemError(
              indexOfRequestedItem,
              requestedItem.id,
              requestedItem.name,
              ['duplicate modifier detected for item'],
            ),
          );
          console.log(
            `duplicate modgroup ${id} in order @ item#${indexOfRequestedItem} item_id:${requestedItem.id}`,
          );
        } else {
          requestedModIds.add(id);
        }
      });
    if (itemErrors.length > 0) {
      return { hasDuplicateModifiers: true, errors: itemErrors };
    }
    return { hasDuplicateModifiers: false, errors: [] };
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

function checkOptionsExistOnModifiers(
  requestedMods: OrderDetailModDto[],
  modDataByModId: OrderModgroupDataEntity,
) {
  let requestedModIdToRequestedOptionIds: Map<number, Set<Number>> = new Map();

  requestedMods.forEach((requestedMod, idx, arr) => {
    let options = requestedMod.modifierItemIds;
    let setOfOptionIdsForGivenMod;
    if (requestedModIdToRequestedOptionIds.has(requestedMod.id)) {
      setOfOptionIdsForGivenMod = requestedModIdToRequestedOptionIds.get(
        requestedMod.id,
      );
    } else {
      setOfOptionIdsForGivenMod = new Set();
      requestedModIdToRequestedOptionIds.set(
        requestedMod.id,
        setOfOptionIdsForGivenMod,
      );
    }
    // add the options to the mod
    options.forEach(setOfOptionIdsForGivenMod.add, setOfOptionIdsForGivenMod);
  });

  let modErrors: ModError[] = [];

  let optionsAreValid = true;

  // check that each requestedOption exists on the associated requestedMod
  requestedMods.forEach((requestedMod, idx, arr) => {
    let { id: requestedModId, modifierItemIds: requestedOptionIds } =
      requestedMod;
    let validRequestedOptionsForModifier = false;
    validRequestedOptionsForModifier = requestedOptionIds.every(
      (requestedOptionId) =>
        requestedModIdToRequestedOptionIds
          .get(requestedModId)
          ?.has(requestedOptionId),
    );

    if (!validRequestedOptionsForModifier) {
      optionsAreValid = false;
      console.log(`invalid modoption for mod`);
      let modError = new ModError(
        requestedMod.id,
        modDataByModId[requestedModId].name,
      );
      modError.modErr.push(
        `invalid modifier option for ${requestedMod[requestedModId]} encountered`,
      );
      modErrors.push(modError);
    }
  });
  return { result: optionsAreValid, errors: modErrors };
}

function checkOptionsActive(
  requestedMods: OrderDetailModDto[],
  modDataByModId: OrderModgroupDataEntity,
  optionData: OrderModOptDataEntity[],
) {
  let modErrors: ModError[] = [];

  let validOptions = true;
  let optionDataByOptionId = OrderService.createMappingByKey(
    optionData,
    'item_id',
  );

  requestedMods.forEach((requestedMod, idx, arr) => {
    let { id: requestedModId, modifierItemIds: requestedOptionIds } =
      requestedMod;
    let validRequestedOptionsForModifier = false;
    let optionsActiveOnModifier = requestedOptionIds.every(
      (requestedOptionId) =>
        optionDataByOptionId[requestedOptionId].item_active,
    );

    validRequestedOptionsForModifier = optionsActiveOnModifier;
    if (!validRequestedOptionsForModifier) {
      validOptions = false;
      console.log(`invalid modoption for mod`);
      let modError = new ModError(
        requestedMod.id,
        modDataByModId[requestedModId].name,
      );
      modError.modErr.push(
        `invalid modifier option for ${requestedMod[requestedModId]} encountered`,
      );
      modErrors.push(modError);
    }
  });
  return { result: validOptions, errors: modErrors };
}

function checkRequestedOptionConstraints(
  requestedMods: OrderDetailModDto[],
  modDataByModId: OrderModgroupDataEntity,
) {
  let modErrors: ModError[] = [];
  requestedMods.forEach((requestedMod, index) => {
    let requestedModId = requestedMod.id;
    let requestedOptionIds = requestedMod.modifierItemIds;

    let modError = new ModError(
      requestedMod.id,
      modDataByModId[requestedModId].name,
    );

    // check that the requested modopts meets the requirements
    // get requirements for this modgroup
    let reqs = modDataByModId[requestedModId];

    // total modopt count must be at least required_selection
    if (requestedOptionIds.length < reqs.required_selection) {
      console.log(
        `recieved ${requestedOptionIds.length} but expected at least ${reqs.required_selection} selection(s)`,
      );
      modError.modErr.push(
        `${modDataByModId[requestedModId].name} requires at least ${reqs.required_selection} selection(s)`,
      );
    }
    // total modopt count must be less than max_selection
    if (requestedOptionIds.length > reqs.max_selection) {
      console.log(
        `recieved ${requestedOptionIds.length} but expected at most ${reqs.max_selection} selection(s)`,
      );
      modError.modErr.push(
        `${modDataByModId[requestedModId].name} can only have a max of ${reqs.max_selection} selection(s)`,
      );
    }

    let requestedOptionIdToQuantityRequested = chain(requestedOptionIds)
      .countBy()
      .value();

    Object.keys(requestedOptionIdToQuantityRequested).forEach(
      (requestedOptionId) => {
        // no single modopt can be more than max_single_selection
        if (
          requestedOptionIdToQuantityRequested[requestedOptionId] >
          reqs.max_single_select
        ) {
          console.log(
            `recieved ${requestedOptionIdToQuantityRequested[requestedOptionId]}x ${requestedOptionId} but the limit is ${reqs.max_single_select}`,
          );
          modError.modErr.push(
            `For ${modDataByModId[requestedModId].name}, you can only have at most ${reqs.max_single_select} of the same selection`,
          );
        }
      },
    );

    if (modError.modErr.length > 0) {
      modErrors.push(modError);
    }
  });

  if (modErrors.length > 0) {
    return { result: false, errors: modErrors };
  }
  return { result: true, errors: [] };
}

function itemPriceIsValid(
  itemData: OrderItemDataEntity,
  requestedItem: OrderDetailItemDto,
): Boolean {
  if (Number(itemData.item_price) !== requestedItem.price) {
    console.log(
      `expected ${requestedItem.price} but got ${Number(itemData.item_price)}`,
    );
    return false;
  }
  return true;
}

type OptionPricingData = {
  option: number;
  quantity: number;
  price: number;
};

type ModifierPricingDatum = {
  modifier: number;
  options: OptionPricingData[];
  price: number;
};

type ModifierPricingDatumWithFree = ModifierPricingDatum & { free?: number };

/**
 *
 * @param itemId
 * @param requestedMods
 * @param modDataByModId
 * @param optionData
 * @param itemDataByItemId
 * @returns Array containing pricing data on mods and their options
 */
function extractPricingDataOfModifiersAndOptions(
  itemId: number,
  requestedMods: OrderDetailModDto[],
  modDataByModId: OrderModgroupDataEntity,
  optionData: OrderModOptDataEntity[],
  itemDataByItemId: OrderItemDataDict,
) {
  let modifierPriceData: ModifierPricingDatum[] = [];

  requestedMods.forEach((requestedMod) => {
    let optionPriceData: OptionPricingData[] = [];
    let requestedModId = requestedMod.id;
    let optionIds = requestedMod.modifierItemIds;

    let optionQtyByOptionId = chain(optionIds).countBy().value();

    optionIds.forEach((optionId) => {
      let optionDatum = optionData.find(
        (data) => data.mod_id === requestedModId && data.item_id === itemId,
      );

      let optionPrice = 0;
      if (optionDatum !== null && optionDatum !== undefined) {
        optionPrice = Number(optionDatum.modopt_price);
      }

      optionPriceData.push({
        option: optionId,
        quantity: optionQtyByOptionId[optionId],
        price: optionPrice,
      });
    });
    let modPriceDataPoint: ModifierPricingDatum = {
      modifier: requestedModId,
      options: optionPriceData,
      price: Number(modDataByModId[requestedModId].price),
    };
    modifierPriceData.push(modPriceDataPoint);
  });
  return modifierPriceData;
}
