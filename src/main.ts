import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(
    session({
      name: 'ssn',
      secret: 'my-secret', // todo: change to get from env var
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 360000 }, // 360s
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
