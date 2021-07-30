// 35m

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  i = 0;

  serializeUser(user: UserDto, done: (err: Error | null, user: any) => void) {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error | null, user: any) => void) {
    let x = { ...payload };
    done(null, x);
  }
}
