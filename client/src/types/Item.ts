import { Modifier } from './Modifiers';

export interface Item {
  item_id?: number;

  name: string;

  description?: string;

  is_standalone?: boolean;

  price?: number;

  mods: Pick<Modifier, 'mod_id' | 'display_order'>[];
}
