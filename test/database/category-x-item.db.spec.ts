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

import { CreateCategoryXItemDto } from 'src/category-x-item/dto/create-category-x-item.dto';
import { CategoryXItem } from 'src/category-x-item/entities/category-x-item.entity';
import { UpdateCategoryXItemDto } from 'src/category-x-item/dto/update-category-x-item.dto';

describe('category-item Controller (e2e)', () => {
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
      // '01_menu.ts',
      '02_category.ts',
      '03_item.ts',
      '03a_category_X_item.ts',
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

  let catItemShape = expect.objectContaining({
    category_id: expect.any(Number),

    item_id: expect.any(Number),

    display_order: expect.any(Number),
  });

  describe('GET category-item/:cid/:iid', () => {
    it('returns a category-item', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/category-item/1/1`,
      );
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body).toStrictEqual(catItemShape);
    });
    it('returns 404 when category-item not found', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/category-item/1/100`,
      );
      expect.assertions(1);
      expect(status).toBe(404);
    });
  });

  describe('GET /category-item', () => {
    it('returns all category-items', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/category-item`,
      );
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body).toHaveLength(17);
      expect(body[0]).toStrictEqual(catItemShape);
    });
  });

  it('should fail when create duplicate category-item', async () => {
    let categoryItem: CreateCategoryXItemDto = {
      category_id: 1,
      item_id: 1,
      display_order: 40,
    };
    const { status, body }: APIResponse<CategoryXItem> = await request(server)
      .post(`/category-item`)
      .send(categoryItem);
    expect.assertions(1);
    expect(status).toBe(400);
  });

  describe('sequential test', () => {
    let newCategoryId: number;
    let newItemId: number;

    describe('POST /category-item', () => {
      it('should create a category-item', async () => {
        let categoryItem: CreateCategoryXItemDto = {
          category_id: 1,
          item_id: 4,
          display_order: 90,
        };
        const { status, body }: APIResponse<CategoryXItem> = await request(
          server,
        )
          .post(`/category-item`)
          .send(categoryItem);
        expect.assertions(3);
        expect(status).toBe(201);
        expect(body).toStrictEqual(catItemShape);
        expect(body.item_id).toBe(4);
        if (body.item_id) newItemId = body.item_id;
        if (body.category_id) newCategoryId = body.category_id;
      });
    });

    describe('PUT /category-item', () => {
      it('should modify a category-item', async () => {
        let updatedCategoryItem: UpdateCategoryXItemDto = {
          display_order: 1,
        };
        const { status, body }: APIResponse<CategoryXItem> = await request(
          server,
        )
          .put(`/category-item/${newCategoryId}/${newItemId}`)
          .send(updatedCategoryItem);
        expect.assertions(3);
        expect(status).toBe(200);
        expect(body).toStrictEqual(catItemShape);
        expect(body.display_order).toBe(1);
      });
    });

    describe('DELETE /category-item', () => {
      it('should remove a category-item', async () => {
        const { status, body }: APIResponse<CategoryXItem> = await request(
          server,
        ).delete(`/category-item/${newCategoryId}/${newItemId}`);
        expect.assertions(5);
        expect(status).toBe(200);
        expect(body).toStrictEqual(catItemShape);
        expect(body.item_id).toBe(newItemId);
        expect(body.category_id).toBe(newCategoryId);
        expect(body.display_order).toBe(1);
      });
    });
  });

  // describe('GET /item?query', () => {
  //   it('returns all items', async () => {
  //     const { status, body } = await request(app.getHttpServer()).get(`/item`);
  //     expect.assertions(4);
  //     expect(status).toBe(200);
  //     expect(body[0]).toStrictEqual(modgroupShape);
  //     expect(body[1]).toStrictEqual(modgroupShape);
  //     expect(body[0]).not.toHaveProperty('private_note');
  //     // expect(body.length).toBe()
  //   });
  // });

  // todo: address how to resolve fk restrictions
});
