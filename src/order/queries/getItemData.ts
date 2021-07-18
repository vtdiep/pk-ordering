import { Knex, knex } from 'knex';
import { OrderItemDataEntity } from '../entities/orderItemData.entity';

export function getItemDataBaseQuery(knexConnectionParam?: Knex) {
  let knexConnection: Knex;
  if (!knexConnectionParam) {
    knexConnection = knex({ client: 'pg' });
  } else {
    knexConnection = knexConnectionParam;
  }
  return knexConnection
    .select<any, OrderItemDataEntity[]>([
      'i.item_id',
      'i.name as item_name',
      knexConnection.raw('i.price::numeric as item_price'),
      'i.active as item_active',
      knexConnection.raw('array_agg(ixm.mod_id) as mods'),
    ])
    .from('item as i')
    .join('item_X_modgroup as ixm', 'i.item_id', 'ixm.item_id');
}
