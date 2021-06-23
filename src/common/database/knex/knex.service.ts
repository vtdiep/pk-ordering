import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { knex, Knex } from 'knex';

const knexfile = require('../../../knexfile');

const config: Knex.Config = knexfile.development;

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  private knex: Knex;

  async onModuleInit() {
    this.knex = knex(config);
    try {
      await this.knex.raw('select 1');
    } catch (error) {
      Logger.error(`Knex: Failed to connect to database; closing program...`);
      Logger.error(error);
      Logger.error(`Knex: Config was ${JSON.stringify(config)}`);
      process.exit(1);
    }
    Logger.log(`Knex: Connected to database - OK`);
  }

  async onModuleDestroy() {
    await this.knex.destroy();
    Logger.log('Knex: Disconnected from database');
    // throw new Error('Method not implemented.');
  }

  get_knex() {
    if (!this.knex) {
      this.knex = knex(config);
    }
    return this.knex;
  }
}
