import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { MenuXCategoryService } from './menu-x-category.service';

describe('MenuXCategoryService', () => {
  let service: MenuXCategoryService;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuXCategoryService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    service = module.get<MenuXCategoryService>(MenuXCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
