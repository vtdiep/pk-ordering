import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { Context } from 'src/utils/types/prisma.context';
import { PrismaService } from '../common/database/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private ctx: PrismaContext) {}

  async create(createOrderDto: CreateOrderDto) {
    let { details } = createOrderDto;

    let {items} = details

    let dbResults = await this.ctx.prisma.item.findMany()

    return this.ctx.prisma.order.create({
      data: createOrderDto,
    });
  }

  async findAll() {
    return this.ctx.prisma.order.findMany();
  }

  async findOne(id: number) {
    return this.ctx.prisma.order.findUnique({
      where: {
        oid: id,
      },
    });
  }

  async update(id: number, updateOrderDto: Prisma.orderUpdateInput) {
    return this.ctx.prisma.order.update({
      where: {
        oid: id,
      },
      data: updateOrderDto,
    });
  }

  async remove(id: number) {
    return this.ctx.prisma.order.delete({
      where: {
        oid: id,
      },
    });
  }
}
