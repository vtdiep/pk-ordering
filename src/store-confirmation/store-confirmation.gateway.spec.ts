import { Test, TestingModule } from '@nestjs/testing';
import { StoreConfirmationGateway } from './store-confirmation.gateway';

describe('StoreConfirmationGateway', () => {
  let gateway: StoreConfirmationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreConfirmationGateway],
    }).compile();

    gateway = module.get<StoreConfirmationGateway>(StoreConfirmationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
