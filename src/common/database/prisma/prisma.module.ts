import { Module } from '@nestjs/common';
import { PrismaContext } from './prisma.context.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, PrismaContext],
  exports: [PrismaService, PrismaContext],
})
export class PrismaModule {}
