import { OrderModOptDataEntity } from './entities/orderModOptData.entity';

export interface OrderModoptDataDictByItemId {
  [x: number]: OrderModOptDataEntity;
  // intended semantic equivalent
  // [x: OrderModOptDataEntity['item_id']]: OrderModOptDataEntity;
  // ie key is actually OrderModOptDataEntity['item_id'] but aliases arent allowed because reasons: https://github.com/microsoft/TypeScript/issues/37448
}
