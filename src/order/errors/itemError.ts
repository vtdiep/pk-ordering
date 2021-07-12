import { ModError } from './modError';

export class ItemError {
  /** ie first item, second item, third item, etc in the order;
   *  sequence is used to differentiate between identical item_ids in the same order */
  sequence: number;

  item_id: number;

  itemname: string;

  itemErr: string[];

  modErrors: ModError[];

  constructor(
    sequence: number,
    item_id: number,
    itemname: string,
    itemErr: string[] = [],
    modErrors: ModError[] = [],
  ) {
    this.sequence = sequence;
    this.item_id = item_id;
    this.itemname = itemname;
    this.itemErr = itemErr;
    this.modErrors = modErrors;
  }
}
