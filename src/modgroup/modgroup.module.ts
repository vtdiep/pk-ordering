import { Module } from '@nestjs/common';
import { ModgroupService } from './modgroup.service';
import { ModgroupController } from './modgroup.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';



  


@Module({
  
  imports: [PrismaModule],
  controllers: [ModgroupController],
  providers: [ModgroupService]
})
export class ModgroupModule {}
