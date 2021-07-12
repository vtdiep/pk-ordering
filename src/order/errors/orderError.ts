import { ItemError } from './itemError';

export class OrderError {
  orderErr: string[];

  itemErrors: ItemError[];

  constructor(orderErr: string[] = [], itemErrors: ItemError[] = []) {
    this.orderErr = orderErr;
    this.itemErrors = itemErrors;
  }
}
