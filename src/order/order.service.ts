import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {
  }
  
  async create(createOrderDto: Prisma.orderCreateInput) {
    return this.prisma.order.create({
      data: createOrderDto
    })
  }

  async findAll() {
    return this.prisma.order.findMany()
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: {
        oid: id
      }
    })
  }

  async update(id: number, updateOrderDto: Prisma.orderUpdateInput) {
    return this.prisma.order.update({
      where: {
        oid: id
      },
      data: updateOrderDto
    })
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: {
        oid: id
      }
    })
  }
}
