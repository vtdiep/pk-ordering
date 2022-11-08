import { Test, TestingModule } from '@nestjs/testing';
import { ModchoiceService } from './modchoice.service';

describe('ModchoiceService', () => {
  let service: ModchoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModchoiceService],
    }).compile();

    service = module.get<ModchoiceService>(ModchoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
