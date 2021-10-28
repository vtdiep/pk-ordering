import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../common/constants';
import { getStoreDataQuery } from './storeDataQuery';

@Injectable()
export class StoreService {
  constructor(@Inject(KNEX_CONNECTION) private knex: Knex) {}

  async findAll() {
    let res = await getStoreDataQuery(this.knex);
    return res;
  }
}
