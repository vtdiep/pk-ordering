import { Test, TestingModule } from '@nestjs/testing';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { order } from '@prisma/client';
import { KNEX_CONNECTION } from 'src/common/constants';
import { knex } from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { subSeconds } from 'date-fns';
import { StoreConfirmationGateway } from 'src/store-confirmation/store-confirmation.gateway';
import { StripeService } from 'src/stripe/stripe.service';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { getModgroupDataBaseQuery } from './queries/getModgroupData';
import { getItemDataBaseQuery } from './queries/getItemData';
import { getModOptionDataBaseQuery } from './queries/getModOptionData';
import {
  makeMockItemData,
  makeMockModgroupData,
  makeMockModOptData,
  makeMockOrder,
} from './fixtures/mockData';
// jest.mock('../common/database/knex/knex.service', ()=>{
//   return { db: knex({client:MockClient})}
// })

describe('OrderService', () => {
  let service: OrderService;
  let mockCtx: MockContext;
  let ctx: Context;
  let tracker: Tracker;
  let modgroupQueryResult: any;
  let itemQueryResult: any;
  let modOptionQueryResult: any;

  const MockStoreConfirmationGateway = {
    notifyOfNewOrder() {},
  };

  const mockURL = 'http://example.com';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const payment_intent = 'pi_1234567890';

  const MockStripeService = {
    createSession: jest.fn(() => ({ payment_intent, url: mockURL })),
  };

  beforeAll(() => {});

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
        {
          provide: KNEX_CONNECTION,
          useValue: knex({ client: MockClient }),
        },
        {
          provide: StoreConfirmationGateway,
          useValue: MockStoreConfirmationGateway,
        },
        {
          provide: StripeService,
          useValue: MockStripeService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    tracker = getTracker();
    modOptionQueryResult = tracker.on.any(
      getModOptionDataBaseQuery().toString(),
    );
    itemQueryResult = tracker.on.any(getItemDataBaseQuery().toString());
    modgroupQueryResult = tracker.on.any(getModgroupDataBaseQuery().toString());
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('example test', async () => {
    const orderDTO: CreateOrderDto = makeMockOrder();

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder).not.toBe({});
    expect(newOrder.url).toBe(mockURL);
  });

  it('should accept multiple seperate entries of the same item', async () => {
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items = [
        {
          id: 1,
          name: 'Hello',
          price: 3,
          quantity: 1,
          mods: [{ id: 1, modifierItemIds: [10] }],
        },
        {
          id: 1,
          name: 'Hello',
          price: 3,
          quantity: 1,
          mods: [{ id: 1, modifierItemIds: [10] }],
        },
      ];
      draft.amount_paid = 6;
      draft.tax = 0;
    });

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder.url).toBe(mockURL);
  });

  it('should accept multiple of the same item but different modifiers', async () => {
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items = [
        {
          id: 1,
          name: 'Hello',
          price: 3,
          quantity: 1,
          mods: [{ id: 1, modifierItemIds: [10] }],
        },
        {
          id: 1,
          name: 'Hello',
          price: 3,
          quantity: 1,
          mods: [{ id: 2, modifierItemIds: [11] }],
        },
      ];
      draft.amount_paid = 3 + 3;
      draft.tax = 0;
    });

    modgroupQueryResult.response([
      makeMockModgroupData(),
      makeMockModgroupData((draft) => {
        draft.mod_id = 2;
      }),
    ]);
    itemQueryResult.response([
      // add modgroup to original item
      makeMockItemData((draft) => {
        draft.mods.push(2);
      }),
    ]);
    modOptionQueryResult.response([
      makeMockModOptData(),
      // link moditem to modgroup
      makeMockModOptData((draft) => {
        draft.item_id = 11;
        draft.mod_id = 2;
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder.url).toBe(mockURL);
  });
  it('should not require a modgroup to be selected', async () => {
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].mods = [];
    });

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder.url).toBe(mockURL);
  });
  it.skip('should throw when no items specified', async () => {});
  it('should throw when pickup_time is too far in the past; ie > 1min past', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.pickup_time = subSeconds(new Date(), 61);
    });

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when pickup_time is too far in the future', async () => {
    throw new Error('tbd');
  });

  it('should throw when amount_paid incorrect', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.amount_paid = 99;
    });

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when tax incorrect', async () => {
    throw new Error('tbd');
  });
  it('should throw when requested item doesnt exist', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].id = 2;
    });

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when requested item is inactive', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder();

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([
      makeMockItemData((draft) => {
        draft.item_active = false;
      }),
    ]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when requested modgroup doesnt exist', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder();

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([
      makeMockItemData((draft) => {
        draft.mods = [];
      }),
    ]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when requested modoption doesnt exist', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder();

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([
      // makeMockModOptData()
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when requested modoption is inactive', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder();

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([
      makeMockModOptData((draft) => {
        draft.item_active = false;
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });

  it('should throw when a submitted item price is incorrect', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].price = 4.25;
    });

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when required # of modoption selections not met', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder();

    modgroupQueryResult.response([
      makeMockModgroupData((draft) => {
        draft.required_selection = 2;
      }),
    ]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([
      makeMockModOptData((draft) => {
        draft.required_selection = 2;
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when max # of modoption selections exceeded', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].mods = [{ id: 1, modifierItemIds: [10, 10] }];
    });

    modgroupQueryResult.response([makeMockModgroupData()]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([makeMockModOptData()]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should accept multiple different modgroups on the same item', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].mods = [
        { id: 1, modifierItemIds: [10] },
        { id: 2, modifierItemIds: [11] },
      ];
    });
    modgroupQueryResult.response([
      makeMockModgroupData(),
      makeMockModgroupData((draftModgroup) => {
        draftModgroup.mod_id = 2;
      }),
    ]);
    itemQueryResult.response([
      makeMockItemData((draftItem) => {
        draftItem.mods = [1, 2];
      }),
    ]);
    modOptionQueryResult.response([
      makeMockModOptData(),
      makeMockModOptData((draftModOpt) => {
        draftModOpt.item_id = 11;
        draftModOpt.mod_id = 2;
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder.url).toBe(mockURL);
  });
  it('should throw when the same modgroup is repeated on the same item', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].mods = [
        { id: 1, modifierItemIds: [10] },
        { id: 1, modifierItemIds: [10] },
      ];
    });

    modgroupQueryResult.response([
      makeMockModgroupData((draft) => {
        draft.max_selection = 2;
        draft.max_single_select = 2;
        draft.free_selection = 2;
      }),
    ]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([
      makeMockModOptData((draft) => {
        draft.max_selection = 2;
        draft.max_single_select = 2;
        draft.free_selection = 2;
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should throw when max # of single modoption selections exceeded', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].mods = [{ id: 1, modifierItemIds: [10, 10] }];
    });

    modgroupQueryResult.response([
      makeMockModgroupData((draft) => {
        draft.max_selection = 3;
      }),
    ]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([
      makeMockModOptData((draft) => {
        draft.max_selection = 3;
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    await expect(service.create(orderDTO)).rejects.toThrowError();
  });
  it('should calculate correct price when modoptions are not free', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.amount_paid = 7.01;
    });

    modgroupQueryResult.response([
      makeMockModgroupData((draft) => {
        draft.free_selection = 0;
        draft.price = '4';
      }),
    ]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([
      makeMockModOptData((draft) => {
        draft.free_selection = 0;
        draft.mod_price = '4';
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder.url).toBe(mockURL);
  });
  it('should calculate correct price when # of free modoptions exceeded', async () => {
    expect.assertions(1);
    const orderDTO: CreateOrderDto = makeMockOrder((draft) => {
      draft.details.items[0].mods = [{ id: 1, modifierItemIds: [10, 10] }];
      draft.amount_paid = 5.01;
    });

    modgroupQueryResult.response([
      makeMockModgroupData((draftModgroup) => {
        draftModgroup.max_single_select = 2;
        draftModgroup.max_selection = 2;
        draftModgroup.price = '2';
      }),
    ]);
    itemQueryResult.response([makeMockItemData()]);
    modOptionQueryResult.response([
      makeMockModOptData((draftModopt) => {
        draftModopt.max_selection = 2;
        draftModopt.max_single_select = 2;
        draftModopt.mod_price = '2';
      }),
    ]);

    mockCtx.prisma.order.create.mockResolvedValue({
      oid: 1,
    } as Partial<order> as order);
    const newOrder = await service.create(orderDTO);
    expect(newOrder.url).toBe(mockURL);
  });
  it.skip('should throw when requested modgroup is inactive', async () => {});
  it.skip('should throw when details is empty', async () => {});
  it.skip('should throw when details is missing', async () => {});
  it.skip('should throw when details.items is missing', async () => {});
  it.skip('should throw when details.items is empty', async () => {});
  it.skip('should throw when mod requested but no modoption specified', async () => {});
});
