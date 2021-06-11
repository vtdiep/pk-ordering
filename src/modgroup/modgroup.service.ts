import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Injectable()
export class ModgroupService {
  constructor(private prisma: PrismaService) {}

  create(createModgroupDto: Prisma.modgroupCreateInput) {
    return this.prisma.modgroup.create({
      data: createModgroupDto,
    });
  }

  findAll() {
    return this.prisma.modgroup.findMany();
  }

  findOne(id: number) {
    return this.prisma.modgroup.findUnique({
      where: {
        mod_id: id,
      },
    });
  }

  update(id: number, updateModgroupDto: Prisma.modgroupUpdateInput) {
    return this.prisma.modgroup.update({
      where: {
        mod_id: id,
      },
      data: updateModgroupDto,
    });
  }

  remove(id: number) {
    return this.prisma.modgroup.delete({
      where: {
        mod_id: id,
      },
    });
  }
}
