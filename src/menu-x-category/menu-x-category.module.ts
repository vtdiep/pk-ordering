import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { MenuXCategoryService } from './menu-x-category.service';

import { MenuXCategoryController } from './menu-x-category.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MenuXCategoryController],
  providers: [MenuXCategoryService],
})
export class MenuXCategoryModule {}
