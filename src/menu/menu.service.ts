import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  create(createMenuDto: Prisma.menuCreateInput) {
    return this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  findAll() {
    return this.prisma.menu.findMany();
  }

  findOne(id: number) {
    return this.prisma.menu.findUnique({
      where: {
        menu_id: id,
      },
    });
  }

  update(id: number, updateMenuDto: Prisma.menuUpdateInput) {
    return this.prisma.menu.update({
      where: {
        menu_id: id,
      },
      data: updateMenuDto,
    });
  }

  remove(id: number) {
    return this.prisma.menu.delete({
      where: {
        menu_id: id,
      },
    });
  }
}
