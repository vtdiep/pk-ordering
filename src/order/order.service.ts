import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/common/constants';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { StoreOrderEntity } from 'src/store-confirmation/dto/store-order.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { StoreConfirmationGateway } from '../store-confirmation/store-confirmation.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderModoptDataByItemId } from './order-modopt-data-by-item-id.interface';
import { validateOrder } from './order-validation';

type TRecordKey = string | number;
type TIndexable = {
  [key: TRecordKey]: any;
};

@Injectable()
export class OrderService {
  constructor(
    private ctx: PrismaContext,
    @Inject(KNEX_CONNECTION) private knex: Knex,
    private storeGateway: StoreConfirmationGateway,
    private stripeService: StripeService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    let { orderErr, itemDataByItemId, modData, modOptData } =
      await validateOrder(createOrderDto, this.knex);

    if (orderErr.orderErr.length > 0 || orderErr.itemErrors.length > 0) {
      console.log(orderErr.orderErr);
      console.log(`${JSON.stringify(orderErr.itemErrors)}`);
      throw new BadRequestException('Invalid order');
    }

    let optionDataByItemId: OrderModoptDataByItemId = modOptData.reduce(
      (acc, val) => ({
        ...acc,
        [val.item_id]: val,
      }),
      {},
    );

    let session = await this.stripeService.createSession(
      createOrderDto,
      optionDataByItemId,
    );
    if (!session.payment_intent) {
      throw new ServiceUnavailableException();
    }

    let storeOrderEntity = new StoreOrderEntity(
      createOrderDto,
      itemDataByItemId,
      modData,
      modOptData,
      String(session.payment_intent),
    );

    await this.storeGateway.notifyOfNewOrder(storeOrderEntity);

    let { oid } = await this.ctx.prisma.order.create({
      data: storeOrderEntity,
      select: {
        oid: true,
      },
    });

    return { url: session.url! };
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
