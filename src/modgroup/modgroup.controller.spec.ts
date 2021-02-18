import { Test, TestingModule } from '@nestjs/testing';
import { ModgroupController } from './modgroup.controller';
import { ModgroupService } from './modgroup.service';

describe('ModgroupController', () => {
  let controller: ModgroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModgroupController],
      providers: [ModgroupService],
    }).compile();

    controller = module.get<ModgroupController>(ModgroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
