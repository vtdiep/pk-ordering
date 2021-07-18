import { Knex, knex } from 'knex';
import { OrderModOptDataEntity } from '../entities/orderModOptData.entity';

export const getModOptionDataBaseQuery = function (knexConnectionParam?: Knex) {
  let knexConnection: Knex;
  if (!knexConnectionParam) {
    knexConnection = knex({ client: 'pg' });
  } else {
    knexConnection = knexConnectionParam;
  }
  return knexConnection
    .select<any, OrderModOptDataEntity[]>([
      'mi.mod_id',
      'mi.item_id',
      'mi.price as modopt_price',
      'i.name as modopt_name',
      'i.price as item_price',
      'i.active as item_active',
      'm2.name as mod_name',
      'm2.required_selection',
      'm2.max_selection',
      'm2.max_single_select',
      'm2.free_selection',
      'm2.price as mod_price',
      'm2.description',
    ])
    .from('modgroup_item as mi')
    .join('item as i', 'i.item_id', 'mi.item_id')
    .join('modgroup as m2', 'm2.mod_id', 'mi.mod_id');
};
