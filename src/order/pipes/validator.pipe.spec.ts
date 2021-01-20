import { KnexService } from '../../common/database/knex/knex.service';
import { ValidatorPipe } from './validator.pipe';

describe('ValidatorPipe', () => {
  let mockKnexService

  beforeEach( async () => {
    mockKnexService = {
      knex: {

      }
  }
  })

  it('should be defined', () => {
    expect(new ValidatorPipe(mockKnexService)).toBeDefined();
  });
});
