import { Knex } from 'knex';

/**
 * Seed for menu table
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE menu RESTART IDENTITY CASCADE');

  // Inserts seed entries
  await knex('menu').insert([
    {
      name: 'Breakfast',
      display_order: 1,
      description: 'Best Breakfast in Town!',
      private_note: 'Let Bera change menu for next month',
    },
    { name: 'Lunch', display_order: 2, active: false },
  ]);
}
