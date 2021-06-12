import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { CategoryXItemService } from './category-x-item.service';
import { CategoryXItemController } from './category-x-item.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryXItemController],
  providers: [CategoryXItemService],
})
export class CategoryXItemModule {}
