import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { WsAdapter } from '@nestjs/platform-ws/adapters';
import { StoreConfirmationModule } from 'src/store-confirmation/store-confirmation.module';
import { Knex } from 'knex';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { KnexService } from 'src/common/database/knex/knex.service';
import { KNEX_CONNECTION } from 'src/common/constants';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { APIResponse } from 'test/apiResponse';
import { Menu } from 'src/menu/entities/menu.entity';

describe('MenuController (e2e)', () => {
  let app: INestApplication;
  let prismaCtx: PrismaContext;
  let knex: Knex;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    knex = app.get<Knex>(KNEX_CONNECTION);
    prismaCtx = app.get<PrismaContext>(PrismaContext);
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
    await knex.seed.run({
      directory: './src/common/database/knex/seeds/dev', // relative to knexfile location
      specific: '01_menu.ts',
    });
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });

  let menuShape = expect.objectContaining({
    name: expect.any(String),

    display_order: expect.any(Number),
  });

  describe('GET /menu/:id', () => {
    it('returns an menu', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/menu/${1}`,
      );
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body).toStrictEqual(menuShape);
    });
  });

  describe('GET /menu', () => {
    it('returns all menus', async () => {
      const { status, body } = await request(app.getHttpServer()).get(`/menu`);
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body[0]).toStrictEqual(menuShape);
      expect(body[1]).toStrictEqual(menuShape);
    });
  });

  describe('ordered dynamic test', () => {
    describe('POST /menu', () => {
      it('adds an menu', async () => {
        const { status, body }: APIResponse<Menu> = await request(
          app.getHttpServer(),
        )
          .post(`/menu`)
          .send({
            name: 'Dinner',
            display_order: 3,
            description: 'DinDin',
          });
        expect.assertions(3);
        expect(status).toBe(201);
        expect(body).toStrictEqual(menuShape);
        expect(body.menu_id).toEqual(3);
      });
    });

    describe('PATCH /menu/:id', () => {
      it('updates a menu', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch(`/menu/3`)
          .send({
            name: 'modified',
          });

        expect.assertions(2);
        await expect(status).toBe(200);
        expect(body.name).toBe('modified');
      });
    });

    // todo: address how to resolve fk restrictions
    describe('DELETE /menu/:id', () => {
      it('deletes an menu with no categories', async () => {
        const { status, body } = await request(app.getHttpServer()).delete(
          `/menu/3`,
        );
        expect.assertions(2);
        await expect(status).toBe(200);
        await expect(body).toStrictEqual(menuShape);
      });
    });
  });
});
