import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { MenuXCategoryController } from './menu-x-category.controller';
import { MenuXCategoryService } from './menu-x-category.service';

describe('MenuXCategoryController', () => {
  let controller: MenuXCategoryController;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuXCategoryController],
      providers: [
        MenuXCategoryService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    controller = module.get<MenuXCategoryController>(MenuXCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
