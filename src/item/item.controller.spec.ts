import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

describe('ItemController', () => {
  let controller: ItemController;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
