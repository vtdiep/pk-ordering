import { Module } from '@nestjs/common';

import { StoreService } from './store.service';

import { StoreController } from './store.controller';
import { KnexModule } from '../common/database/knex/knex.module';

@Module({
  imports: [KnexModule],

  controllers: [StoreController],

  providers: [StoreService],
})
export class StoreModule {}
