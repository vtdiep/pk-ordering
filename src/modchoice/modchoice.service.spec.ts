import { Test, TestingModule } from '@nestjs/testing';
import knex from 'knex';
import { MockClient } from 'knex-mock-client';
import { KNEX_CONNECTION } from 'src/common/constants';
import { ModchoiceService } from './modchoice.service';

describe('ModchoiceService', () => {
  let service: ModchoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModchoiceService,
        {
          provide: KNEX_CONNECTION,
          useValue: knex({ client: MockClient }),
        },
      ],
    }).compile();

    service = module.get<ModchoiceService>(ModchoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
