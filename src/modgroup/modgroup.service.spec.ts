import { Test, TestingModule } from '@nestjs/testing';
import { ModgroupService } from './modgroup.service';

describe('ModgroupService', () => {
  let service: ModgroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModgroupService],
    }).compile();

    service = module.get<ModgroupService>(ModgroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
