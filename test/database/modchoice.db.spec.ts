import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { WsAdapter } from '@nestjs/platform-ws/adapters';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/common/constants';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { APIResponse } from 'test/apiResponse';
import { createMock } from '@golevelup/ts-jest';

// todo: rewrite import once https://github.com/jest-community/jest-extended/pull/559 released
import 'jest-extended';
import 'jest-extended/all';

import { CreateModgroupDto } from 'src/modgroup/dto/create-modgroup.dto';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';
import { UpdateModgroupDto } from 'src/modgroup/dto/update-modgroup.dto';
import { Choices } from 'src/common/database/entities/Choices.entity';
import { ChoicesDTO } from 'src/modchoice/dto/Choices.dto';
import { ModchoicesDTO } from 'src/modchoice/dto/Modchoices.dto';

describe('ModchoiceController (e2e)', () => {
  let app: INestApplication;
  let prismaCtx: PrismaContext;
  let knex: Knex;
  const mockWsAdapter = createMock<WsAdapter>();
  let server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    knex = app.get<Knex>(KNEX_CONNECTION);
    prismaCtx = app.get<PrismaContext>(PrismaContext);
    app.useWebSocketAdapter(mockWsAdapter);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    server = app.getHttpServer();

    let seeds = [
      '01_menu.ts',
      '02_category.ts',
      '03_item.ts',
      '03a_category_X_item.ts',
      '03b_menu_X_category.ts',
      '04_modgroup.ts',
      '05_item_X_modgroup.ts',
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (let seed of seeds) {
      // eslint-disable-next-line no-await-in-loop
      await knex.seed.run({
        directory: './src/common/database/knex/seeds/dev', // relative to knexfile location
        specific: seed,
      });
    }
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });

  const choicesDTO = {
    choice_id: expect.any(Number),
    name: expect.any(String),
    description: expect.toBeOneOf([expect.any(String), null]),
    active: expect.toBeOneOf([expect.any(Boolean), null]),
    is_standalone: expect.toBeOneOf([expect.any(Boolean), null]),
    // todo: consider change price to be number/Decimal or non-string value w/o dollar sign $
    price: expect.toBeOneOf([expect.any(Number), null, expect.any(String)]),
    private_note: expect.toBeOneOf([expect.any(String), null]),
    mi_price: expect.toBeOneOf([expect.any(Number), null]),
    display_order: expect.any(Number),
  };

  const modchoiceShape: ModchoicesDTO = {
    mod_id: expect.any(Number),
    choices: expect.arrayContaining([expect.objectContaining(choicesDTO)]),
    choice_ids: expect.arrayContaining([expect.any(Number)]),
  };

  describe('GET /modchoice', () => {
    it('returns all modchoices', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/modchoice`,
      );
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body[0]).toStrictEqual(modchoiceShape);
    });
    it('returns empty when modchoice not found', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/modchoice/${170}`,
      );
      expect.assertions(1);
      expect(body).toEqual([]);
    });
  });

  describe('GET /modchoice/:item_id', () => {
    it('returns an array of modchoice', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/modchoice/5/`,
      );
      expect.assertions(4);
      expect(status).toBe(200);
      expect(body).toHaveLength(2);
      // expect(body).toEqual(modchoiceShape);
      expect(body[0]).toEqual(expect.objectContaining(modchoiceShape));
      expect(body[1]).toEqual(expect.objectContaining(modchoiceShape));
    });
  });
});
