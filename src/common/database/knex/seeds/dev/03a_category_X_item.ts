import { category, category_X_item, item } from '@prisma/client';
import { Knex } from 'knex';
import { CreateItemDto } from '../../../../../item/dto/create-item.dto';
import { Item } from '../../../../../item/entities/item.entity';
import {
  BURGER_ITEMS,
  EGG_ITEMS,
  FRIES_SIDES_ITEMS,
  OMELETTE_ITEMS,
  PANCAKE_ITEMS,
} from './03_item';

/**
 * Seed for category table
 */

let displayOrder = 1;

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE "category_X_item" RESTART IDENTITY CASCADE');

  let categories = await knex<category>('category')
    .select(['category_id', 'name'])
    .orderBy('category_id', 'asc');

  let databaseItems = await knex<item>('item')
    .select(['item_id', 'name'])
    .orderBy('item_id', 'asc');

  // Category Ids
  let omeletteId: number =
    categories.find((x) => x.name === 'Omelettes')?.category_id ??
    (throwErr("Missing 'Omelettes' category") as unknown as number);
  let pancakeId: number =
    categories.find((x) => x.name === 'Pancakes')?.category_id ??
    (throwErr("Missing 'Pancakes' category") as unknown as number);
  let eggId: number =
    categories.find((x) => x.name === 'Eggs')?.category_id ??
    (throwErr("Missing 'Eggs' category") as unknown as number);
  let burgerId: number =
    categories.find((x) => x.name === 'Burgers')?.category_id ??
    (throwErr("Missing 'Burgers' category") as unknown as number);
  let friesAndSidesId: number =
    categories.find((x) => x.name === 'Fries & Sides')?.category_id ??
    (throwErr("Missing 'Fries & Sides' category") as unknown as number);

  let omeletteEntries = createEntries(
    OMELETTE_ITEMS,
    omeletteId,
    databaseItems,
  );
  let pancakeEntries = createEntries(PANCAKE_ITEMS, pancakeId, databaseItems);
  let eggEntries = createEntries(EGG_ITEMS, eggId, databaseItems);
  let burgerEntries = createEntries(BURGER_ITEMS, burgerId, databaseItems);
  let friesAndSidesEntries = createEntries(
    FRIES_SIDES_ITEMS,
    friesAndSidesId,
    databaseItems,
  );

  // Inserts seed entries
  await knex<category_X_item>('category_X_item').insert([
    ...omeletteEntries,
    ...pancakeEntries,
    ...eggEntries,
    ...burgerEntries,
    ...friesAndSidesEntries,
  ]);
}

function createEntries(
  rawItemData: Item[],
  categoryId: number,
  databaseItemData: Pick<item, 'name' | 'item_id'>[],
) {
  let namesOfItemsInCategory = rawItemData.map((x) => x.name);
  let itemIdsInCategory = databaseItemData
    .filter((databaseItem) =>
      namesOfItemsInCategory.includes(databaseItem.name),
    )
    .map((x) => x.item_id);

  let entries = itemIdsInCategory.reduce((prev: category_X_item[], cur) => {
    prev.push({
      category_id: categoryId,
      item_id: cur,
      // eslint-disable-next-line no-plusplus
      display_order: displayOrder++,
    });
    return prev;
  }, []);
  return entries;
}

// throw expressions are not (yet) supported by typescript
// https://stackoverflow.com/questions/60884426/how-to-check-for-null-value-inline-and-throw-an-error-in-typescript
function throwErr(msg?: string) {
  throw Error(msg);
}
