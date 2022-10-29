import { Mods } from './Mods.entity';

export class ItemModsJSON {
  item_id: number;

  mods: Array<Omit<Mods, 'item_id>'>>;

  mod_ids: number[];
}

// type reference = ExpandRecursively<ItemModsJSON>
