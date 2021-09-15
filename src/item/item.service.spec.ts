import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
