import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/database/prisma/prisma.service';
// Dont forget to import { PrismaService } from somewhere;

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService){

  }

  create(createCategoryDto: Prisma.categoryCreateInput) {
    return this.prisma.category.create({
      data: createCategoryDto
    })
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: {
        category_id: id
      }
    });
  }

  update(id: number, updateCategoryDto: Prisma.categoryUpdateInput) {
    return this.prisma.category.update({
      where: {
        category_id: id
      },
      data: updateCategoryDto
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: {
        category_id: id
      }
    });
  }
}
