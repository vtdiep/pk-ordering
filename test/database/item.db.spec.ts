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
import { Item } from 'src/item/entities/item.entity';

describe('ItemController (e2e)', () => {
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
      specific: '03_item.ts',
    });

    // item table seedfile truncates, removing linked entries in join tables
    // need to seed item joined tables
    await knex.seed.run({
      directory: './src/common/database/knex/seeds/dev', // relative to knexfile location
      specific: '03a_category_X_item.ts',
    });

    await knex.seed.run({
      directory: './src/common/database/knex/seeds/dev', // relative to knexfile location
      specific: '05_item_X_modgroup.ts',
    });
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });

  let itemShape = expect.objectContaining({
    item_id: expect.any(Number),

    name: expect.any(String),

    active: expect.any(Boolean),

    is_standalone: expect.any(Boolean),

    price: expect.any(Number),
  });

  describe('private_note property should be excluded', () => {
    it('should exclude private_note when GET /item/:id', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/item/${1}`,
      );
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body).not.toHaveProperty('private_note');
    });
  });

  describe('GET /item/:id', () => {
    it('returns an item', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/item/${1}`,
      );
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body).toStrictEqual(itemShape);
      expect(body).not.toHaveProperty('private_note');
    });
    it('returns nothing when non-existent item', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/item/${100}`,
      );
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body).toEqual({});
    });
    it('returns item w/ mod info when requested', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/item/${1}/?include=true`,
      );
      // console.log(body)
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body).toHaveProperty('mods');
      expect(body.mods).toHaveLength(1);
    });
    it('returns item w/o mod info when not requested', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/item/${1}/`,
      );
      // console.log(body)
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body).not.toHaveProperty('mods');
    });
  });

  describe('GET /item', () => {
    it('returns all items', async () => {
      const { status, body } = await request(app.getHttpServer()).get(`/item`);
      expect.assertions(4);
      expect(status).toBe(200);
      expect(body[0]).toStrictEqual(itemShape);
      expect(body[1]).toStrictEqual(itemShape);
      expect(body[0]).not.toHaveProperty('private_note');
    });
  });

  describe('ordered dynamic test', () => {
    describe('POST /item', () => {
      it('adds an item', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post(`/item`)
          .send({
            item_id: 90,
            name: 'test',
            active: false,
            is_standalone: false,
            price: 50,
          });
        expect.assertions(2);
        expect(status).toBe(201);
        expect(body).toStrictEqual(itemShape);
      });
    });

    describe('PUT /item/:id', () => {
      it('updates an item', async () => {
        const { status, body }: APIResponse<Item> = await request(
          app.getHttpServer(),
        )
          .put(`/item/90`)
          .send({
            name: 'modified',
          });

        expect.assertions(2);
        await expect(status).toBe(200);
        expect(body.name).toBe('modified');
      });
    });

    // todo: address how to resolve fk restrictions
    describe('DELETE /item/:id', () => {
      it('deletes an item with no mods', async () => {
        const { status, body } = await request(app.getHttpServer()).delete(
          `/item/90`,
        );
        expect.assertions(2);
        await expect(status).toBe(200);
        await expect(body).toStrictEqual(itemShape);
      });
    });
  });
});
