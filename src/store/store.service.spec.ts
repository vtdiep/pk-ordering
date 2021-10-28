import { Test, TestingModule } from '@nestjs/testing';
import { knex } from 'knex';
import { getTracker, MockClient, RawQuery, Tracker } from 'knex-mock-client';
import { KNEX_CONNECTION } from '../common/constants';
import { getStoreDataQuery } from './storeDataQuery';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let knexTracker: Tracker;
  let knexResultForStoreDataQuery: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: KNEX_CONNECTION,
          useValue: knex({ client: MockClient }),
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    knexTracker = getTracker();

    // custom matcher because getStoreDataQuery().toString() != getStoreDataQuery().toSQL()
    knexResultForStoreDataQuery = knexTracker.on.any(
      // eslint-disable-next-line arrow-body-style
      ({ method, sql, bindings }: RawQuery) => {
        return getStoreDataQuery().toSQL().sql.includes(sql);
      },
    );
  });

  afterEach(() => {
    knexTracker.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return store data', async () => {
    let mockResponse = {
      data: {
        menus: [
          {
            menu_id: 1,
            menu_name: 'Breakfast',
            menu_display_order: 1,
            menu_active: true,
            menu_description: 'Best Breakfast in Town!',
            category: [
              {
                items: [
                  {
                    cxi_do: 1,
                    item_id: 1,
                  },
                ],
                category_id: 1,
                category_name: 'Omelettes',
                category_active: true,
                mxc_display_order: 1,
                category_description: 'Eggy and fluffy',
              },
              {
                items: [
                  {
                    cxi_do: 4,
                    item_id: 4,
                  },
                ],
                category_id: 2,
                category_name: 'Pancakes',
                category_active: true,
                mxc_display_order: 2,
                category_description: null,
              },
            ],
          },
          {
            menu_id: 2,
            menu_name: 'Lunch',
            menu_display_order: 2,
            menu_active: false,
            menu_description: null,
            category: [
              {
                items: [
                  {
                    cxi_do: 1,
                    item_id: 1,
                  },
                ],
                category_id: 1,
                category_name: 'Omelettes',
                category_active: true,
                mxc_display_order: 1,
                category_description: 'Eggy and fluffy',
              },
            ],
          },
        ],
        items: [
          {
            item_id: 1,
            name: 'Ham & Cheese Omelette',
            description: null,
            price: '$5.00',
          },
          {
            item_id: 4,
            name: 'Buckwheat Pancake',
            description: 'Nutty',
            price: '$2.50',
          },
        ],
      },
    };
    knexResultForStoreDataQuery.response(mockResponse);

    const result = await service.findAll();
    expect.assertions(1);
    expect(result).toEqual(mockResponse);
  });
});
