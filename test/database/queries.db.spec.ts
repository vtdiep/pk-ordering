import { Test, TestingModule } from '@nestjs/testing';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/common/constants';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { KnexService } from 'src/common/database/knex/knex.service';
import {
  getChoices,
  getChoicesForItem,
  jsonChoices,
} from 'src/common/database/knex/queries';

// todo: make tests less brittle/ less heavy
describe('queries', () => {
  let db: Knex;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [KnexModule],
      providers: [],
    }).compile();

    db = module.get(KNEX_CONNECTION);
    await db.seed.run({
      directory: './src/common/database/knex/seeds/dev', // relative to knexfile location
    });
  });

  afterAll(async () => {
    await db.destroy();
    await module.close();
  });

  beforeEach(async () => {});

  it('should be defined', () => {
    expect(db).toBeDefined();
  });

  it('getChoices', async () => {
    let result = await getChoices(db);
    let expected = [
      {
        mod_id: 1,
        mi_price: null,
        display_order: 0,
        item_id: 18,
        name: 'No Salt',
        description: '',
        active: true,
        is_standalone: false,
        price: '$0.00',
        private_note: '',
      },
      {
        mod_id: 2,
        mi_price: null,
        display_order: 0,
        item_id: 19,
        name: 'Butter',
        description: 'Comes from cows',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: '',
      },

      {
        mod_id: 2,
        mi_price: null,
        display_order: 1,
        item_id: 20,
        name: 'Margarine',
        description: 'Slightly sweet',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },

      {
        mod_id: 3,
        mi_price: null,
        display_order: 0,
        item_id: 21,
        name: 'Strawberries',
        description: 'Red',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: '',
      },
      {
        mod_id: 3,
        mi_price: null,
        display_order: 1,
        item_id: 22,
        name: 'Blueberries',
        description: 'Blue',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },
      {
        mod_id: 3,
        mi_price: null,
        display_order: 2,
        item_id: 23,
        name: 'Syrup',
        description: 'Sweet',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },
      {
        mod_id: 3,
        mi_price: null,
        display_order: 3,
        item_id: 24,
        name: 'Honey',
        description: 'Naturally sweet',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },
    ];
    expect(result.length).toEqual(7);
    expect(result[2]).toEqual(expected[2]);
  });

  it('getChoicesForItem', async () => {
    let result = await getChoicesForItem(db, 4);
    let expected = [
      {
        mod_id: 2,
        mi_price: null,
        display_order: 0,
        item_id: 19,
        name: 'Butter',
        description: 'Comes from cows',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: '',
      },
      {
        mod_id: 2,
        mi_price: null,
        display_order: 1,
        item_id: 20,
        name: 'Margarine',
        description: 'Slightly sweet',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },
      {
        mod_id: 3,
        mi_price: null,
        display_order: 0,
        item_id: 21,
        name: 'Strawberries',
        description: 'Red',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: '',
      },

      {
        mod_id: 3,
        mi_price: null,
        display_order: 1,
        item_id: 22,
        name: 'Blueberries',
        description: 'Blue',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },
      {
        mod_id: 3,
        mi_price: null,
        display_order: 2,
        item_id: 23,
        name: 'Syrup',
        description: 'Sweet',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },
      {
        mod_id: 3,
        mi_price: null,
        display_order: 3,
        item_id: 24,
        name: 'Honey',
        description: 'Naturally sweet',
        active: true,
        is_standalone: false,
        price: '$2.50',
        private_note: null,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('jsonChoices w/o item specified', async () => {
    let result = await jsonChoices(db);
    let expected = [
      {
        mod_id: 1,
        choices: [
          {
            name: 'No Salt',
            price: '$0.00',
            active: true,
            item_id: 18,
            mi_price: null,
            description: '',
            private_note: '',
            display_order: 0,
            is_standalone: false,
          },
        ],
        choice_ids: [18],
      },
      {
        mod_id: 2,
        choices: [
          {
            name: 'Butter',
            price: '$2.50',
            active: true,
            item_id: 19,
            mi_price: null,
            description: 'Comes from cows',
            private_note: '',
            display_order: 0,
            is_standalone: false,
          },
          {
            name: 'Margarine',
            price: '$2.50',
            active: true,
            item_id: 20,
            mi_price: null,
            description: 'Slightly sweet',
            private_note: null,
            display_order: 1,
            is_standalone: false,
          },
        ],
        choice_ids: [19, 20],
      },
      {
        mod_id: 3,
        choices: [
          {
            name: 'Strawberries',
            price: '$2.50',
            active: true,
            item_id: 21,
            mi_price: null,
            description: 'Red',
            private_note: '',
            display_order: 0,
            is_standalone: false,
          },
          {
            name: 'Blueberries',
            price: '$2.50',
            active: true,
            item_id: 22,
            mi_price: null,
            description: 'Blue',
            private_note: null,
            display_order: 1,
            is_standalone: false,
          },
          {
            name: 'Syrup',
            price: '$2.50',
            active: true,
            item_id: 23,
            mi_price: null,
            description: 'Sweet',
            private_note: null,
            display_order: 2,
            is_standalone: false,
          },
          {
            name: 'Honey',
            price: '$2.50',
            active: true,
            item_id: 24,
            mi_price: null,
            description: 'Naturally sweet',
            private_note: null,
            display_order: 3,
            is_standalone: false,
          },
        ],
        choice_ids: [21, 22, 23, 24],
      },
    ];

    expect(result).toEqual(expected);
  });

  it('jsonChoices w item specified', async () => {
    let result = await jsonChoices(db, 4);
    let expected = [
      {
        mod_id: 2,
        choices: [
          {
            name: 'Butter',
            price: '$2.50',
            active: true,
            item_id: 19,
            mi_price: null,
            description: 'Comes from cows',
            private_note: '',
            display_order: 0,
            is_standalone: false,
          },
          {
            name: 'Margarine',
            price: '$2.50',
            active: true,
            item_id: 20,
            mi_price: null,
            description: 'Slightly sweet',
            private_note: null,
            display_order: 1,
            is_standalone: false,
          },
        ],
        choice_ids: [19, 20],
      },
      {
        mod_id: 3,
        choices: [
          {
            name: 'Strawberries',
            price: '$2.50',
            active: true,
            item_id: 21,
            mi_price: null,
            description: 'Red',
            private_note: '',
            display_order: 0,
            is_standalone: false,
          },
          {
            name: 'Blueberries',
            price: '$2.50',
            active: true,
            item_id: 22,
            mi_price: null,
            description: 'Blue',
            private_note: null,
            display_order: 1,
            is_standalone: false,
          },
          {
            name: 'Syrup',
            price: '$2.50',
            active: true,
            item_id: 23,
            mi_price: null,
            description: 'Sweet',
            private_note: null,
            display_order: 2,
            is_standalone: false,
          },
          {
            name: 'Honey',
            price: '$2.50',
            active: true,
            item_id: 24,
            mi_price: null,
            description: 'Naturally sweet',
            private_note: null,
            display_order: 3,
            is_standalone: false,
          },
        ],
        choice_ids: [21, 22, 23, 24],
      },
    ];

    expect(result).toEqual(expected);
  });
});
