import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
