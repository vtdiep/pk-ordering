import { store } from '@prisma/client';
import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE "store" RESTART IDENTITY CASCADE');

  // todo: set to use env var
  let saltRounds = 14;

  console.time('bcrypt');
  let hash = await bcrypt.hash('salmon', saltRounds);
  console.timeEnd('bcrypt');

  await knex<store>('store').insert([
    { username: 'store#1', password_hash: hash },
  ]);
}
