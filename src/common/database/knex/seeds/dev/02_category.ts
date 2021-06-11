import * as Knex from 'knex';

/**
 * Seed for category table
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE category RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('category').insert([
    {
      name: 'Omelettes',
      description: 'Eggy and fluffy',
      private_note: 'Most profitable',
    },
    { name: 'Pancakes' },
    { name: 'Eggs', active: false, private_note: 'Still in development' },
    { name: 'Burgers' },
    { name: 'Fries & Sides' },
  ]);
}
