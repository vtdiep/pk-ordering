import { OrderItemDataEntity } from './entities/orderItemData.entity';

export interface OrderItemDataDict {
  [x: number]: OrderItemDataEntity;
  // intended semantic equivalent
  // [x: OrderItemDataEntity['item_id']]: OrderItemDataEntity;
  // ie key is actually OrderItemDataEntity['item_id'] but aliases arent allowed because reasons: https://github.com/microsoft/TypeScript/issues/37448
}
