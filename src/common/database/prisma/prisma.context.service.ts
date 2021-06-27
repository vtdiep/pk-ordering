import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Context } from 'src/utils/types/prisma.context';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaContext implements Context {
  prisma: PrismaClient;

  constructor(private readonly prismaService: PrismaService) {
    this.prisma = prismaService;
  }
}
