import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { ModgroupService } from './modgroup.service';
import { ModgroupController } from './modgroup.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ModgroupController],
  providers: [ModgroupService],
})
export class ModgroupModule {}
