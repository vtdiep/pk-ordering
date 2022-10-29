import { item_X_modgroup } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Item } from 'src/item/entities/item.entity';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';

export class Mods implements Modgroup {
  name: string;

  required_selection: number;

  max_selection: number;

  max_single_select: number;

  free_selection: number;

  price?: number | Decimal | undefined;

  description?: string | undefined;

  private_note?: string | undefined;

  item_id: NonNullable<Item['item_id']>;

  mod_id: NonNullable<Modgroup['mod_id']>;

  display_order: item_X_modgroup['display_order'];
}

// type reference = ExpandRecursively<ModsJSON>
