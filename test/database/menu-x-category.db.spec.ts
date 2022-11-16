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
import { MenuXCategory } from 'src/menu-x-category/entities/menu-x-category.entity';
import { APIResponse } from 'test/apiResponse';

describe('MenuXCategoryController (e2e)', () => {
  let app: INestApplication;
  let prismaCtx: PrismaContext;
  let knex: Knex;
  let mXcResult: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    knex = app.get<Knex>(KNEX_CONNECTION);
    prismaCtx = app.get<PrismaContext>(PrismaContext);
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
    await knex.raw('TRUNCATE TABLE menu RESTART IDENTITY CASCADE');
    await knex.raw('TRUNCATE TABLE category RESTART IDENTITY CASCADE');
    await knex.raw('TRUNCATE TABLE "menu_X_category" RESTART IDENTITY CASCADE');
    let menu = await prismaCtx.prisma.menu.create({
      data: {
        name: 'Lunch Menu',

        display_order: 2,

        active: true,

        description: 'Lunch menu',

        private_note: 'Todo: Prixe fixe',
      },
    });
    let category = await prismaCtx.prisma.category.create({
      data: {
        name: 'Sandwiches',

        active: true,

        description: 'Bread, meat, veggies',
      },
    });
    mXcResult = await prismaCtx.prisma.menu_X_category.create({
      data: {
        category_id_category: category.category_id,

        menu_id_menu: menu.menu_id,

        display_order: 0,
      },
    });
  });

  afterAll(async () => {
    // await knex.raw('TRUNCATE TABLE menu RESTART IDENTITY CASCADE');
    // await knex.raw('TRUNCATE TABLE category RESTART IDENTITY CASCADE');
    // await knex.raw('TRUNCATE TABLE "menu_X_category" RESTART IDENTITY CASCADE');
    await knex.destroy();
    await app.close();
  });

  let menuXcategoryShape: MenuXCategory = expect.objectContaining({
    category_id_category: expect.any(Number),
  });

  describe('GET /menu-x-category', () => {
    it('returns a menu-x-category', async () => {
      let menuXcategory = mXcResult as MenuXCategory;
      const { status, body }: APIResponse<MenuXCategory> = await request(
        app.getHttpServer(),
      ).get(
        `/menu-x-category/${menuXcategory.menu_id_menu}/${menuXcategory.category_id_category}`,
      );
      expect.assertions(2);
      expect(status).toBe(200);
      expect(body).toStrictEqual(menuXcategoryShape);
    });
  });

  describe('GET /menu-x-category', () => {
    it('returns all menu-x-categories', async () => {
      const { status, body }: APIResponse<Array<MenuXCategory>> = await request(
        app.getHttpServer(),
      ).get(`/menu-x-category`);
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body[0]).toStrictEqual(menuXcategoryShape);
      expect(body.length).toEqual(1);
    });
  });

  // describe('ordered dynamic test', () => {
  //   describe('POST /category', () => {
  //     it('adds an category', async () => {
  //       const { status, body }: APIResponse<MenuXCategory> = await request(app.getHttpServer())
  //         .post(`/category`)
  //         .send({
  //           category_id: 90,
  //           name: 'test'
  //         });
  //       expect.assertions(2);
  //       expect(status).toBe(201);
  //       expect(body).toStrictEqual(menuXcategoryShape);
  //     });
  //   });

  // describe('PUT /category/:id', () => {
  //   it('updates an category', async () => {
  //     const { status, body } : APIResponse<MenuXCategory>= await request(app.getHttpServer())
  //       .put(`/category/90`)
  //       .send({
  //         name: 'modified',
  //         description: 'a modified test category'
  //       });

  //     expect.assertions(3);
  //     await expect(status).toBe(200);
  //     expect(body.name).toBe('modified');
  //     expect(body.description).toBe('a modified test category');
  //   });
  // });

  // todo: address how to resolve fk restrictions
  // describe.skip('DELETE /category/:id', () => {
  //   it('deletes an category with no mods', async () => {
  //     const { status, body } : APIResponse<MenuXCategory>= await request(app.getHttpServer()).delete(
  //       `/category/90`,
  //     );
  //     expect.assertions(2);
  //     await expect(status).toBe(200);
  //     await expect(body).toStrictEqual(menuXcategoryShape);
  //   });
  // });
  // });
});
