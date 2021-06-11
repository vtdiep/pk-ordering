import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/common/database/prisma/prisma.service';
import { OrderService } from './order.service';
import { mockedPrismaService } from '../../src/utils/mocks/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: mockedPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('example test', async () => {
    // EXAMPLE for test w/ mocking
    // this test is not a useful test bc orderService does nothing but a call to the db
    // so, if we try to test orderService by making a stub/mock, we are effectively testing
    // the stub/mocking framework.
    // If we want to test the db call, then we should do it in integration testing
    // If orderService did something more than a db call, then it would be worth testing here
    // with a mock/stub for the db call, so that we can verify that orderService actually did something to the db call result
    const orderDTO: CreateOrderDto = {
      email: 'red@gmail.com',
      name: 'Red Color',
      pickup_time: new Date(),
      amount_paid: 10.01,
      tax: 0.01,
      details: {},
    };
    const newOrder = await service.create(orderDTO);
    expect(newOrder).not.toBe({});
  });
});
