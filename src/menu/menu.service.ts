import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';

@Injectable()
export class MenuService {
  constructor(private prismaCtx: PrismaContext) {}

  create(createMenuDto: Prisma.menuCreateInput) {
    return this.prismaCtx.prisma.menu.create({
      data: createMenuDto,
    });
  }

  findAll() {
    return this.prismaCtx.prisma.menu.findMany();
  }

  findOne(id: number) {
    return this.prismaCtx.prisma.menu.findUnique({
      where: {
        menu_id: id,
      },
    });
  }

  update(id: number, updateMenuDto: Prisma.menuUpdateInput) {
    return this.prismaCtx.prisma.menu.update({
      where: {
        menu_id: id,
      },
      data: updateMenuDto,
    });
  }

  remove(id: number) {
    return this.prismaCtx.prisma.menu.delete({
      where: {
        menu_id: id,
      },
    });
  }
}
