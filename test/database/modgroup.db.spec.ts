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

describe('ModgroupController (e2e)', () => {
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

  let modgroupShape = expect.objectContaining({
    mod_id: expect.any(Number),

    name: expect.any(String),

    required_selection: expect.any(Number),

    max_selection: expect.any(Number),

    max_single_select: expect.any(Number),

    free_selection: expect.any(Number),

    price: expect.any(Number),

    description: expect.toBeOneOf([expect.any(String), null]),
  });

  describe('GET /modgroup/:id', () => {
    it('returns a modgroup', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/modgroup/${1}`,
      );
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body).toStrictEqual(modgroupShape);
      expect(body).not.toHaveProperty('private_note');
    });
    it('returns 404 when modgroup not found', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/modgroup/${17}`,
      );
      expect.assertions(1);
      expect(status).toBe(404);
    });
  });

  describe('GET /modgroup/:ids', () => {
    it('returns an array of modgroups', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/modgroup/?ids=1,2,3&other=10`,
      );
      expect.assertions(3);
      expect(status).toBe(200);
      expect(body).toHaveLength(3);
      expect(body[0]).toStrictEqual(modgroupShape);
    });
  });

  describe('sequential test', () => {
    let newModId: number;

    describe('POST /modgroup', () => {
      it('should create a modgroup', async () => {
        let modgroup: CreateModgroupDto = {
          name: 'Required',
          required_selection: 1,
          max_selection: 1,
          max_single_select: 1,
          free_selection: 1,
        };
        const { status, body }: APIResponse<Modgroup> = await request(server)
          .post(`/modgroup`)
          .send(modgroup);
        expect.assertions(3);
        expect(status).toBe(201);
        expect(body).toStrictEqual(modgroupShape);
        expect(body.mod_id).toBe(4);
        if (body.mod_id) newModId = body.mod_id;
        console.log(body);
      });
    });

    describe('PUT /modgroup', () => {
      it('should fail when max < required', async () => {
        let modgroup: UpdateModgroupDto = {
          name: 'Required',
          max_single_select: 1,
          free_selection: 1,
          required_selection: 10,
          max_selection: 3,
        };
        const { status, body }: APIResponse<Modgroup> = await request(server)
          .put(`/modgroup/${newModId}`)
          .send(modgroup);
        expect.assertions(1);
        expect(status).toBe(400);
      });

      it('should modify a modgroup', async () => {
        let modgroup: UpdateModgroupDto = {
          name: 'Not Required Anymore',
          required_selection: 0,
          max_selection: 1,
          max_single_select: 1,
          free_selection: 1,
        };
        const { status, body }: APIResponse<Modgroup> = await request(server)
          .put(`/modgroup/${newModId}`)
          .send(modgroup);
        console.log(body);
        expect.assertions(4);
        expect(status).toBe(200);
        expect(body).toStrictEqual(modgroupShape);
        expect(body.mod_id).toBe(4);
        expect(body).toContainEntries(Object.entries(modgroup));
      });
    });

    describe('DELETE /modgroup', () => {
      it('should remove a modgroup', async () => {
        const { status, body }: APIResponse<Modgroup> = await request(
          server,
        ).delete(`/modgroup/${newModId}`);
        expect.assertions(3);
        expect(status).toBe(200);
        expect(body).toStrictEqual(modgroupShape);
        expect(body.mod_id).toBe(4);
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
