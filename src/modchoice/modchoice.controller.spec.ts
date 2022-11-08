import { Test, TestingModule } from '@nestjs/testing';
import { ModchoiceController } from './modchoice.controller';
import { ModchoiceService } from './modchoice.service';

describe('ModchoiceController', () => {
  let controller: ModchoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModchoiceController],
      providers: [ModchoiceService],
    }).compile();

    controller = module.get<ModchoiceController>(ModchoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
