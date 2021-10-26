/* eslint-disable no-plusplus */
import { Knex } from 'knex';
import { category, menu, menu_X_category } from '.prisma/client';

/**
 * Seed for menu_X_category table
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE "menu_X_category" RESTART IDENTITY CASCADE');

  // number assertion is to get rid of the void type from throwErr
  let breakfastId =
    <number>(
      (
        await knex<menu>('menu')
          .select('menu_id')
          .where('name', '=', 'Breakfast')
          .first()
      )?.menu_id
    ) ?? throwErr();

  let categories = await knex<category>('category').select([
    'category_id',
    'name',
  ]);

  let displayOrder = 1;

  // Inserts seed entries
  await knex<menu_X_category>('menu_X_category').insert([
    {
      menu_id_menu: breakfastId,
      // number assertion is to get rid of the void type from throwErr
      category_id_category:
        <number>categories.find((x) => x.name === 'Omelettes')?.category_id ??
        throwErr('Expected but couldnt find Omelettes'),
      display_order: displayOrder++,
    },
    {
      menu_id_menu: breakfastId,
      // number assertion is to get rid of the void type from throwErr
      category_id_category:
        categories.find((x) => x.name === 'Pancakes')?.category_id ??
        (throwErr('Expected but couldnt find Pancakes') as unknown as number),
      display_order: displayOrder++,
    },
    {
      menu_id_menu: breakfastId,
      // number assertion is to get rid of the void type from throwErr
      category_id_category:
        <number>categories.find((x) => x.name === 'Eggs')?.category_id ??
        throwErr('Expected but couldnt find Eggs'),
      display_order: displayOrder++,
    },
  ]);
}

// throw expressions are not (yet) supported by typescript
// https://stackoverflow.com/questions/60884426/how-to-check-for-null-value-inline-and-throw-an-error-in-typescript
function throwErr(msg?: string) {
  throw Error(msg);
}
