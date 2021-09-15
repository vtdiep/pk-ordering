import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';

@Injectable()
export class MenuXCategoryService {
  constructor(private prismaCtx: PrismaContext) {}

  create(createMenuXCategoryDto: Prisma.menu_X_categoryUncheckedCreateInput) {
    return this.prismaCtx.prisma.menu_X_category.create({
      data: createMenuXCategoryDto,
    });
  }

  findAll() {
    return this.prismaCtx.prisma.menu_X_category.findMany();
  }

  findOne(menu_id: number, category_id: number) {
    return this.prismaCtx.prisma.menu_X_category.findUnique({
      where: {
        category_id_category_menu_id_menu: {
          category_id_category: category_id,
          menu_id_menu: menu_id,
        },
      },
    });
  }

  update(
    menu_id: number,
    category_id: number,
    updateMenuXCategoryDto: Prisma.menu_X_categoryUncheckedUpdateInput,
  ) {
    return this.prismaCtx.prisma.menu_X_category.update({
      where: {
        category_id_category_menu_id_menu: {
          category_id_category: category_id,
          menu_id_menu: menu_id,
        },
      },
      data: updateMenuXCategoryDto,
    });
  }

  remove(menu_id: number, category_id: number) {
    return this.prismaCtx.prisma.menu_X_category.delete({
      where: {
        category_id_category_menu_id_menu: {
          category_id_category: category_id,
          menu_id_menu: menu_id,
        },
      },
    });
  }
}
