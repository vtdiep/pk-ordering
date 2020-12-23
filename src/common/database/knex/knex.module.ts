import { Module } from '@nestjs/common';
import { KnexService } from './knex.service';

@Module({
    imports: [],
    controllers: [],
    providers: [KnexService],
    exports: [KnexService]
})
export class KnexModule {}
