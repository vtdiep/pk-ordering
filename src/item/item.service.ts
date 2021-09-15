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

  findOne(id: number) {
    return this.prismaCtx.prisma.item.findUnique({
      where: {
        item_id: id,
      },
    });
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
