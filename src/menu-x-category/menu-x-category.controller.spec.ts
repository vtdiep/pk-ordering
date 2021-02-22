import { Test, TestingModule } from '@nestjs/testing';
import { MenuXCategoryController } from './menu-x-category.controller';
import { MenuXCategoryService } from './menu-x-category.service';

describe('MenuXCategoryController', () => {
  let controller: MenuXCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuXCategoryController],
      providers: [MenuXCategoryService],
    }).compile();

    controller = module.get<MenuXCategoryController>(MenuXCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
