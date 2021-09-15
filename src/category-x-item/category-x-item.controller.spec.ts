import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { CategoryXItemController } from './category-x-item.controller';
import { CategoryXItemService } from './category-x-item.service';

describe('CategoryXItemController', () => {
  let controller: CategoryXItemController;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryXItemController],
      providers: [
        CategoryXItemService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    controller = module.get<CategoryXItemController>(CategoryXItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
