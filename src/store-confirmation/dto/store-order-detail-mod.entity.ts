import { Prisma } from '@prisma/client';

export class StoreOrderDetailModEntity {
  [x: string]: Prisma.JsonValue;

  modgroup: number;

  modgroup_name: string;

  modifierItemIds: number[];

  modifierItems: string[];
}
