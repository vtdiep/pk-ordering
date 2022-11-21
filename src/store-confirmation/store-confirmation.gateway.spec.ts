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

  it(`should be able to run gateway.'stop order'`, () => {
    expect(gateway.handleMessage({}, {})).toEqual('Hello world!');
  });

  it(`should be able to run gateway.'confirmation'`, () => {
    expect(gateway.handleConfirmation({}, {})).toStrictEqual({
      event: 'confirmed',
      data: 'Hello world!',
    });
  });

  it(`should be able to notify of new order'`, () => {
    expect(gateway.handleMessage({}, {})).toEqual('Hello world!');
  });
});
