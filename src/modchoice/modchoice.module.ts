import { Module } from '@nestjs/common';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { ModchoiceService } from './modchoice.service';
import { ModchoiceController } from './modchoice.controller';

@Module({
  imports: [KnexModule],
  controllers: [ModchoiceController],
  providers: [ModchoiceService],
})
export class ModchoiceModule {}
