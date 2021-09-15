import { Test, TestingModule } from '@nestjs/testing';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import {
  Context,
  createMockContext,
  MockContext,
} from 'src/utils/types/prisma.context';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;
  let prismaCtx: Context;
  let mockPrismaCtx: MockContext;

  beforeEach(async () => {
    mockPrismaCtx = createMockContext();
    prismaCtx = mockPrismaCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        MenuService,
        {
          provide: PrismaContext,
          useValue: prismaCtx,
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
