import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { ModgroupController } from './modgroup.controller';
import { ModgroupService } from './modgroup.service';

describe('ModgroupController', () => {
  let controller: ModgroupController;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModgroupController],
      providers: [
        ModgroupService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    controller = module.get<ModgroupController>(ModgroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
