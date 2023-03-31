import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';

@Injectable()
export class ItemService {
  constructor(private prismaCtx: PrismaContext) {}

  create(createItemDto: Prisma.itemCreateInput) {
    return this.prismaCtx.prisma.item.create({
      data: createItemDto,
    });
  }

  findAll() {
    return this.prismaCtx.prisma.item.findMany();
  }

  findOne(id: number, includeMods: boolean = false) {
    let conditions = {
      where: {
        item_id: id,
      },
      include: includeMods
        ? {
            item_X_modgroup: {
              select: {
                mod_id: true,
                display_order: true,
              },
            },
          }
        : {},
    };
    let query = this.prismaCtx.prisma.item.findUnique(conditions);

    return query;
  }

  update(id: number, updateItemDto: Prisma.itemUpdateInput) {
    return this.prismaCtx.prisma.item.update({
      where: {
        item_id: id,
      },
      data: updateItemDto,
    });
  }

  remove(id: number) {
    return this.prismaCtx.prisma.item.delete({
      where: {
        item_id: id,
      },
    });
  }
}
