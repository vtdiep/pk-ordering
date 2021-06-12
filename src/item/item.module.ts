import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { ItemService } from './item.service';

import { ItemController } from './item.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
