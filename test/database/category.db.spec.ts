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
import { Category } from 'src/category/entities/category.entity';

describe('CategoryController (e2e)', () => {
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
      specific: '02_category.ts',
    });
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });

  let categoryShape = expect.objectContaining({
    category_id: expect.any(Number),
  });

  describe('GET /category/:id', () => {
    it('returns a category', async () => {
      const { status, body }: APIResponse<Category> = await request(
        app.getHttpServer(),
      ).get(`/category/${1}`);
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body).toStrictEqual(categoryShape);
    });
  });

  describe('GET /category', () => {
    it('returns all categories', async () => {
      const { status, body }: APIResponse<Array<Category>> = await request(
        app.getHttpServer(),
      ).get(`/category`);
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body[0]).toStrictEqual(categoryShape);
      expect(body[1]).toStrictEqual(categoryShape);
    });
  });

  describe('ordered dynamic test', () => {
    describe('POST /category', () => {
      it('adds an category', async () => {
        const { status, body }: APIResponse<Category> = await request(
          app.getHttpServer(),
        )
          .post(`/category`)
          .send({
            category_id: 90,
            name: 'test',
          });
        // expect.assertions(2);
        expect(status).toBe(201);
        expect(body).toStrictEqual(categoryShape);
        expect(body.active).toEqual(true);
        expect(body.private_note).toEqual(null);
        expect(body.category_id).toBe(90);
        expect(body.description).toEqual(null);
        expect(body.name).toBe('test');
      });
    });

    describe('PUT /category/:id', () => {
      it('updates an category', async () => {
        const { status, body }: APIResponse<Category> = await request(
          app.getHttpServer(),
        )
          .put(`/category/90`)
          .send({
            name: 'modified',
            description: 'a modified test category',
          });

        expect.assertions(3);
        await expect(status).toBe(200);
        expect(body.name).toBe('modified');
        expect(body.description).toBe('a modified test category');
      });
    });

    // todo: address how to resolve fk restrictions
    describe('DELETE /category/:id', () => {
      it('deletes an category with no mods', async () => {
        const { status, body }: APIResponse<Category> = await request(
          app.getHttpServer(),
        ).delete(`/category/90`);
        expect.assertions(2);
        await expect(status).toBe(200);
        await expect(body).toStrictEqual(categoryShape);
      });
    });
  });
});
