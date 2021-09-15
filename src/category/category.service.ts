import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';

@Injectable()
export class CategoryService {
  constructor(private prismaCtx: PrismaContext) {}

  create(createCategoryDto: Prisma.categoryCreateInput) {
    return this.prismaCtx.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prismaCtx.prisma.category.findMany();
  }

  findOne(id: number) {
    return this.prismaCtx.prisma.category.findUnique({
      where: {
        category_id: id,
      },
    });
  }

  update(id: number, updateCategoryDto: Prisma.categoryUpdateInput) {
    return this.prismaCtx.prisma.category.update({
      where: {
        category_id: id,
      },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prismaCtx.prisma.category.delete({
      where: {
        category_id: id,
      },
    });
  }
}
