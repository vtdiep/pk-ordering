import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  providers: [AuthService, LocalStrategy, SessionSerializer],
  imports: [KnexModule, PassportModule.register({ session: true })],
})
export class AuthModule {}
