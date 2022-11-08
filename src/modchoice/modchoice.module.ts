import { Module } from '@nestjs/common';
import { ModchoiceService } from './modchoice.service';
import { ModchoiceController } from './modchoice.controller';

@Module({
  controllers: [ModchoiceController],
  providers: [ModchoiceService],
})
export class ModchoiceModule {}
