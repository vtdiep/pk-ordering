import { Test, TestingModule } from '@nestjs/testing';
import { MenuXCategoryService } from './menu-x-category.service';

describe('MenuXCategoryService', () => {
  let service: MenuXCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuXCategoryService],
    }).compile();

    service = module.get<MenuXCategoryService>(MenuXCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
