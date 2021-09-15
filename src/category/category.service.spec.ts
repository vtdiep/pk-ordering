import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { CategoryService } from './category.service';

let prismaCtx: Context;
let mockPrismaCtx: MockContext;

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
