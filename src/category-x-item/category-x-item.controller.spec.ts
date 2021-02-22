import { Test, TestingModule } from '@nestjs/testing';
import { CategoryXItemController } from './category-x-item.controller';
import { CategoryXItemService } from './category-x-item.service';

describe('CategoryXItemController', () => {
  let controller: CategoryXItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryXItemController],
      providers: [CategoryXItemService],
    }).compile();

    controller = module.get<CategoryXItemController>(CategoryXItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
