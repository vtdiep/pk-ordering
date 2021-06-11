import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Injectable()
export class CategoryXItemService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryXItemDto: Prisma.category_X_itemUncheckedCreateInput) {
    return this.prisma.category_X_item.create({
      data: createCategoryXItemDto,
    });
  }

  findAll() {
    return this.prisma.category_X_item.findMany();
  }

  findOne(category_id: number, item_id: number) {
    return this.prisma.category_X_item.findUnique({
      where: {
        category_id_item_id: {
          category_id: category_id,
          item_id: item_id,
        },
      },
    });
  }

  update(
    category_id: number,
    item_id: number,
    updateCategoryXItemDto: Prisma.category_X_itemUpdateInput,
  ) {
    let result;
    try {
      result = this.prisma.category_X_item.update({
        where: {
          category_id_item_id: {
            category_id: category_id,
            item_id: item_id,
          },
        },
        data: updateCategoryXItemDto,
      });
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  remove(category_id: number, item_id: number) {
    return this.prisma.category_X_item.delete({
      where: {
        category_id_item_id: {
          category_id: category_id,
          item_id: item_id,
        },
      },
    });
  }
}
