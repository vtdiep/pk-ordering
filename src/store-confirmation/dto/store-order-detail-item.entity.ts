import { Prisma } from '@prisma/client';
import { StoreOrderDetailModEntity } from './store-order-detail-mod.entity';

export class StoreOrderDetailItemEntity implements Prisma.JsonObject {
  [x: string]: Prisma.JsonValue | undefined;

  name: string;

  price: number;

  quantity: number;

  mods?: StoreOrderDetailModEntity[];
}
