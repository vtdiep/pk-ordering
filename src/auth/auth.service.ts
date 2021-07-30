import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/common/constants';
import { KnexService } from 'src/common/database/knex/knex.service';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(KNEX_CONNECTION) private knex: Knex) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: UserDto = { username: 'abc', password: '123' };

    // bcrypt here on input

    // check that hash matches stored hash
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
