import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  create(createItemDto: Prisma.itemCreateInput) {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  findAll() {
    return this.prisma.item.findMany();
  }

  findOne(id: number) {
    return this.prisma.item.findUnique({
      where: {
        item_id: id,
      },
    });
  }

  update(id: number, updateItemDto: Prisma.itemUpdateInput) {
    return this.prisma.item.update({
      where: {
        item_id: id,
      },
      data: updateItemDto,
    });
  }

  remove(id: number) {
    return this.prisma.item.delete({
      where: {
        item_id: id,
      },
    });
  }
}
