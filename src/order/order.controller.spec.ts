import { Test, TestingModule } from '@nestjs/testing';
import { KNEX_CONNECTION } from 'src/common/constants';
import { makeMockOrder } from './fixtures/mockData';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ValidatorPipe } from './pipes/validator.pipe';

const defaultRedirectURL = 'http://example.com';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn().mockReturnValue({ url: 'http://example.com' }),
          },
        },
        {
          provide: ValidatorPipe,
          useValue: {},
        },
        {
          provide: KNEX_CONNECTION,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return with the redirect url', async () => {
      const redirectURL = await controller.create(makeMockOrder());
      console.log(redirectURL);

      expect(redirectURL.url).toBe(defaultRedirectURL);
    });
  });
});
