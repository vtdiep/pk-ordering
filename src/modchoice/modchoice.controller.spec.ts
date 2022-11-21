import { Test, TestingModule } from '@nestjs/testing';
import knex from 'knex';
import { MockClient } from 'knex-mock-client';
import { KNEX_CONNECTION } from 'src/common/constants';
import { ModchoiceController } from './modchoice.controller';
import { ModchoiceService } from './modchoice.service';

describe('ModchoiceController', () => {
  let controller: ModchoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModchoiceController],
      providers: [
        ModchoiceService,
        {
          provide: KNEX_CONNECTION,
          useValue: knex({ client: MockClient }),
        },
      ],
    }).compile();

    controller = module.get<ModchoiceController>(ModchoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
