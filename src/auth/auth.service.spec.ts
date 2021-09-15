import { Test, TestingModule } from '@nestjs/testing';
import { knex } from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { KNEX_CONNECTION } from 'src/common/constants';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockKnexClient: Tracker;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: KNEX_CONNECTION,
          useValue: knex({ client: MockClient }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockKnexClient = getTracker();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return username upon valid username/pw combo', async () => {
    // mockKnexClient.on()
    let res = await service.validateUser('abc', '123');
    expect(res).toEqual({ username: 'abc' });
  });

  it('should return nothing upon invalid username/pw combo', async () => {
    // mockKnexClient.on()
    let res = await service.validateUser('abc', '000');
    expect(res).toBeNull();
  });
});
