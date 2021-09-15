import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';

@Injectable()
export class ModgroupService {
  constructor(private prismaCtx: PrismaContext) {}

  create(createModgroupDto: Prisma.modgroupCreateInput) {
    return this.prismaCtx.prisma.modgroup.create({
      data: createModgroupDto,
    });
  }

  findAll() {
    return this.prismaCtx.prisma.modgroup.findMany();
  }

  findOne(id: number) {
    return this.prismaCtx.prisma.modgroup.findUnique({
      where: {
        mod_id: id,
      },
    });
  }

  update(id: number, updateModgroupDto: Prisma.modgroupUpdateInput) {
    return this.prismaCtx.prisma.modgroup.update({
      where: {
        mod_id: id,
      },
      data: updateModgroupDto,
    });
  }

  remove(id: number) {
    return this.prismaCtx.prisma.modgroup.delete({
      where: {
        mod_id: id,
      },
    });
  }
}
