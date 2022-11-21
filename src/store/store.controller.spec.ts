import { Test, TestingModule } from '@nestjs/testing';
import knex from 'knex';
import { MockClient } from 'knex-mock-client';
import { KNEX_CONNECTION } from 'src/common/constants';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

describe('StoreController', () => {
  let controller: StoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        StoreService,
        {
          provide: KNEX_CONNECTION,
          useValue: knex({ client: MockClient }),
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
