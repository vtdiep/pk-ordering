import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/common/constants';
import { jsonChoices } from 'src/common/database/knex/queries';

@Injectable()
export class ModchoiceService {
  constructor(@Inject(KNEX_CONNECTION) private knex: Knex) {}

  async findAll() {
    let res = await jsonChoices(this.knex);
    return res;
  }

  async findOne(id: number) {
    let res = await jsonChoices(this.knex, id);
    return res;
  }
}
