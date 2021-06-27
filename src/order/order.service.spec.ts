import { Test, TestingModule } from '@nestjs/testing';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { order, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../common/database/prisma/prisma.service';
import { OrderService } from './order.service';
import { mockedPrismaService } from '../utils/mocks/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaContext,
          useValue: ctx,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('example test', async () => {
    const orderDTO: CreateOrderDto = {
      email: 'red@gmail.com',
      name: 'Red Color',
      pickup_time: new Date(),
      amount_paid: new Prisma.Decimal(10.01),
      tax: 0.01,
      details: {
        items: [
          {
            id: 1,
            name: 'Hello',
            price: 10,
            quantity: 1,
            mods: [1],
          },
        ],
      },
    };
    mockCtx.prisma.order.create.mockResolvedValue({
      ...orderDTO,
      transaction_token: 'todo',
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder).not.toBe({});
  });
});
