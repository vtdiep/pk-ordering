import { modgroup_item } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Item } from 'src/item/entities/item.entity';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';

export class Choices implements Item {
  item_id: number;

  name: string;

  description?: string | undefined;

  active?: boolean | undefined;

  is_standalone?: boolean | undefined;

  price?: number | Decimal | undefined;

  private_note?: string | undefined;

  mod_id: NonNullable<Modgroup['mod_id']>;

  mi_price: modgroup_item['price'];

  display_order: modgroup_item['display_order'];
}

// type reference = ExpandRecursively<Choices>
