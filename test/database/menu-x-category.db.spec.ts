import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { WsAdapter } from '@nestjs/platform-ws/adapters';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/common/constants';
import { PrismaContext } from 'src/common/database/prisma/prisma.context.service';
import { MenuXCategory } from 'src/menu-x-category/entities/menu-x-category.entity';
import { APIResponse } from 'test/apiResponse';
import { createMock } from '@golevelup/ts-jest';
import { MenuFixture } from 'test/fixtures/baseMenuFixture';
import { CategoryFixture } from 'test/fixtures/baseCategoryFixture';
import { category, menu } from '@prisma/client';

describe('MenuXCategoryController (e2e)', () => {
  let app: INestApplication;
  let prismaCtx: PrismaContext;
  let knex: Knex;
  let mXcResult: any;
  const mockWsAdapter = createMock<WsAdapter>();
  let server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    knex = app.get<Knex>(KNEX_CONNECTION);
    prismaCtx = app.get<PrismaContext>(PrismaContext);
    // app.useWebSocketAdapter(new WsAdapter(app));
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
    await knex.raw('TRUNCATE TABLE menu RESTART IDENTITY CASCADE');
    await knex.raw('TRUNCATE TABLE category RESTART IDENTITY CASCADE');
    await knex.raw('TRUNCATE TABLE "menu_X_category" RESTART IDENTITY CASCADE');

    let menuData = MenuFixture.makeStruct();
    let existingMenu = await prismaCtx.prisma.menu.create({
      data: menuData,
    });

    let existingCategory = await prismaCtx.prisma.category.create({
      data: {
        name: 'Sandwiches',

        active: true,

        description: 'Bread, meat, veggies',
      },
    });

    mXcResult = await prismaCtx.prisma.menu_X_category.create({
      data: {
        category_id_category: existingCategory.category_id,

        menu_id_menu: existingMenu.menu_id,

        display_order: 0,
      },
    });
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });

  let menuXcategoryShape: MenuXCategory = expect.objectContaining({
    category_id_category: expect.any(Number),

    menu_id_menu: expect.any(Number),

    display_order: expect.any(Number),
  });

  describe('GET /menu-x-category/:menu_id/:category:id', () => {
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
      expect(body).toHaveLength(1);
    });
  });

  describe('ordered test', () => {
    let protoMenu = MenuFixture.makeStruct({
      name: 'test menu',
      display_order: 10,
    });
    let protoCategory = CategoryFixture.makeStruct();
    let menuResult: menu;
    let categoryResult: category;
    let newMenu: menu;
    describe('POST /menu-x-category', () => {
      // todo: make display_order not required, maybe by making it autoincrement for default value

      it('adds an entry', async () => {
        categoryResult = await prismaCtx.prisma.category.create({
          data: protoCategory,
        });
        menuResult = await prismaCtx.prisma.menu.create({
          data: protoMenu,
        });
        const { status, body }: APIResponse<MenuXCategory> = await request(
          server,
        )
          .post(`/menu-x-category/`)
          .send({
            category_id_category: categoryResult.category_id,

            menu_id_menu: menuResult.menu_id,

            display_order: 12,
          });
        expect.assertions(3);
        expect(status).toBe(201);
        expect(body).toStrictEqual(menuXcategoryShape);
        const { body: body2 }: APIResponse<Array<MenuXCategory>> =
          await request(app.getHttpServer()).get(`/menu-x-category`);
        expect(body2).toHaveLength(2);
        // console.log(body2);
      });
    });
    describe('PATCH /menu-x-category', () => {
      it('updates an entry', async () => {
        let protoNewMenu = MenuFixture.makeStruct({
          name: 'replacement',
          display_order: 19,
        });
        newMenu = await prismaCtx.prisma.menu.create({ data: protoNewMenu });
        const { status, body }: APIResponse<MenuXCategory> = await request(
          server,
        )
          .patch(
            `/menu-x-category/?mid=${menuResult.menu_id}&cid=${categoryResult.category_id}`,
          )
          .send({
            category_id_category: categoryResult.category_id,

            menu_id_menu: newMenu.menu_id,

            display_order: 120,
          });
        expect.assertions(2);
        expect(status).toBe(200);
        expect(body).toStrictEqual(menuXcategoryShape);
      });
    });
    describe('/DELETE /menu-x-category', () => {
      it('deletes an entry', async () => {
        const { status, body }: APIResponse<MenuXCategory> = await request(
          server,
        ).delete(
          `/menu-x-category/${newMenu.menu_id}/${categoryResult.category_id}`,
        );
        expect.assertions(3);
        expect(status).toBe(200);
        expect(body).toStrictEqual(menuXcategoryShape);
        // console.log(body);
        const { body: body2 }: APIResponse<Array<MenuXCategory>> =
          await request(app.getHttpServer()).get(`/menu-x-category`);
        expect(body2).toHaveLength(1);
        // console.log(body2);
      });
    });
  });
});
