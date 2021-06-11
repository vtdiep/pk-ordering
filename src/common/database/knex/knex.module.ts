import { Module } from '@nestjs/common';
import { KNEX_CONNECTION } from '../../../common/constants';
import { KnexService } from './knex.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    KnexService,
    {
      provide: KNEX_CONNECTION,
      useFactory: async (knexService) => {
        return knexService.get_knex();
      },
      inject: [KnexService],
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class KnexModule {}
