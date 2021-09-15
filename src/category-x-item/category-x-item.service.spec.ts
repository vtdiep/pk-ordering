import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { CategoryXItemService } from './category-x-item.service';

describe('CategoryXItemService', () => {
  let service: CategoryXItemService;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryXItemService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    service = module.get<CategoryXItemService>(CategoryXItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
