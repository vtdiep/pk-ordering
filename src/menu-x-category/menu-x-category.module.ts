import { Module } from '@nestjs/common';
import { MenuXCategoryService } from './menu-x-category.service';

import { MenuXCategoryController } from './menu-x-category.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MenuXCategoryController],
  providers: [MenuXCategoryService],
})
export class MenuXCategoryModule {}
