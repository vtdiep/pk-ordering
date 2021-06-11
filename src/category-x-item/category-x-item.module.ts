import { Module } from '@nestjs/common';
import { CategoryXItemService } from './category-x-item.service';
import { CategoryXItemController } from './category-x-item.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryXItemController],
  providers: [CategoryXItemService],
})
export class CategoryXItemModule {}
