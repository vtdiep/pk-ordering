import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { MenuService } from './menu.service';

import { MenuController } from './menu.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
