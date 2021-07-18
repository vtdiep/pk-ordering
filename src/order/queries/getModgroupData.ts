import { Knex, knex } from 'knex';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';

export const getModgroupDataBaseQuery = function (knexConnectionParam?: Knex) {
  let knexConnection: Knex;
  if (!knexConnectionParam) {
    knexConnection = knex({ client: 'pg' });
  } else {
    knexConnection = knexConnectionParam;
  }
  return knexConnection<Modgroup>('modgroup').select('*');
};
