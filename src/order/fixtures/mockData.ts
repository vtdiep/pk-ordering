import { Prisma } from '@prisma/client';
import { Draft, immerable, produce } from 'immer';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderItemDataEntity } from '../entities/orderItemData.entity';
import { ModgroupS } from '../entities/orderModgroupData.entity';
import { OrderModOptDataEntity } from '../entities/orderModOptData.entity';

OrderModOptDataEntity[immerable] = true;

export function makeMockModOptData(
  partial?: (draft: Draft<OrderModOptDataEntity>) => void,
): OrderModOptDataEntity {
  const defaults: OrderModOptDataEntity = {
    mod_id: 1,
    item_id: 10,
    modopt_price: null,
    modopt_name: 'Butter',
    item_price: '2.50',
    item_active: true,
    mod_name: 'Select Butter',
    required_selection: 0,
    max_selection: 1,
    max_single_select: 1,
    free_selection: 1,
    mod_price: '0.00',
    description: null,
  };
  if (partial === undefined) {
    return defaults;
  }
  return produce(defaults, partial);
}

export function makeMockItemData(
  partial?: (draft: Draft<OrderItemDataEntity>) => void,
): OrderItemDataEntity {
  const defaults: OrderItemDataEntity = {
    item_id: 1,
    item_name: 'Buckwheat Pancake',
    item_price: '3',
    item_active: true,
    mods: [1],
  };
  if (partial === undefined) {
    return defaults;
  }
  return produce(defaults, partial);
}

export function makeMockModgroupData(
  partial?: (draft: Draft<ModgroupS>) => void,
): ModgroupS {
  const defaults: ModgroupS = {
    mod_id: 1,
    name: 'Select Butter',
    required_selection: 0,
    max_selection: 1,
    max_single_select: 1,
    free_selection: 1,
    price: '0.00',
    description: null,
    private_note: null,
  };
  if (partial === undefined) {
    return defaults;
  }
  return produce(defaults, partial);
}

export function makeMockOrder(
  partial?: (draft: Draft<CreateOrderDto>) => void,
): CreateOrderDto {
  const defaults: CreateOrderDto = {
    email: 'red@gmail.com',
    name: 'Red Color',
    pickup_time: new Date(),
    amount_paid: new Prisma.Decimal(3.01),
    tax: 0.01,
    details: {
      items: [
        {
          id: 1,
          name: 'Hello',
          price: 3,
          quantity: 1,
          mods: [{ id: 1, modifierItemIds: [10] }],
        },
      ],
    },
  };
  if (partial === undefined) {
    return defaults;
  }
  return produce(defaults, partial);
}
