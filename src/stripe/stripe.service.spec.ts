import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { KNEX_CONNECTION, STRIPE_CLIENT } from 'src/common/constants';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { OrderModOptDataEntity } from 'src/order/entities/orderModOptData.entity';
import { makeMockOrder } from 'src/order/fixtures/mockData';
import { OrderService } from 'src/order/order.service';
import { StoreConfirmationGateway } from 'src/store-confirmation/store-confirmation.gateway';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

describe('StripeService', () => {
  let stripe: StripeService;
  let orderService: OrderService;
  let mockStripeAPI = jest.fn();
  const mockStripe: DeepMockProxy<Stripe> = mockDeep<Stripe>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: STRIPE_CLIENT,
          useValue: mockStripe,
        },
        StripeService,
        OrderService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'STRIPE_PRIVATE_KEY') {
                return '123';
              }
              return null;
            }),
          },
        },
        {
          provide: PrismaContext,
          useValue: {},
        },
        {
          provide: KNEX_CONNECTION,
          useValue: {},
        },
        {
          provide: StoreConfirmationGateway,
          useValue: {},
        },
      ],
    }).compile();

    stripe = module.get<any>(StripeService);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(stripe).toBeDefined();
  });

  it('should make a succesful payment to stripe', async () => {
    let c: Partial<Stripe.Response<Stripe.Checkout.Session>> = {
      success_url: 'test/abc',
      payment_intent: 'pi_123',
    };
    // type Mockable<T> = (a:Partial<T>)=><T>
    function dePartial<T>(a: Partial<T>) {
      return a as T;
    }

    mockStripe.checkout.sessions.create.mockResolvedValueOnce(dePartial(c));

    const order: CreateOrderDto = {
      email: 'red@gmail.com',
      name: 'Red Color',
      pickup_time: new Date(),
      amount_paid: new Prisma.Decimal(3.01),
      tax: 0.01,
      details: {
        items: [
          {
            id: 1,
            name: 'Hello',
            price: 3,
            quantity: 1,
            mods: [{ id: 1, modifierItemIds: [10] }],
          },
        ],
      },
    };
    const modoptDict: OrderModOptDataEntity[] = [
      {
        mod_id: 1,
        item_id: 10,
        modopt_price: null,
        modopt_name: 'Butter',
        item_price: '2.50',
        item_active: true,
        mod_name: 'Select Butter',
        required_selection: 0,
        max_selection: 1,
        max_single_select: 1,
        free_selection: 1,
        mod_price: '0.00',
        description: null,
      },
    ];
    const orderDTO: CreateOrderDto = makeMockOrder();
    console.log(stripe);

    let session = await stripe.createSession(
      orderDTO,
      OrderService.convertToDataDictByItemId(modoptDict),
    );
    console.log(session);
    expect(session.payment_intent).toBe('pi_1Dsr4b2eZvKYlo2CxVdpVXXb');
  });
});
