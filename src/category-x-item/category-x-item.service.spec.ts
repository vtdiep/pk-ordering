import { Test, TestingModule } from '@nestjs/testing';
import { CategoryXItemService } from './category-x-item.service';

describe('CategoryXItemService', () => {
  let service: CategoryXItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryXItemService],
    }).compile();

    service = module.get<CategoryXItemService>(CategoryXItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
