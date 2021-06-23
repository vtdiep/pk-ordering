import { Test, TestingModule } from '@nestjs/testing';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/common/constants';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { KnexService } from 'src/common/database/knex/knex.service';

describe('OrderService', () => {
  let db: Knex;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [KnexModule],
      providers: [],
    }).compile();

    db = module.get(KNEX_CONNECTION);
  });

  afterAll(async () => {
    module.close();
  });

  beforeEach(async () => {});

  it('should be defined', () => {
    expect(db).toBeDefined();
  });
});
