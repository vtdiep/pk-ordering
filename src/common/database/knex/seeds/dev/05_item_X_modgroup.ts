/* eslint-disable no-plusplus */
import { Knex } from 'knex';
import { ItemXModgroup } from 'src/common/lib/item_X_modgroup/item_X_modgroup.entity';
import { Item } from 'src/item/entities/item.entity';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';
// relative import b/c knex seed/migrate doesnt have path mapping when compiling
import { assertDefinedArray } from '../../../../../utils/etc/assert';

/**
 * Seed for item_X_modgroup
 * (Matching items to their modifiers)
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE "item_X_modgroup" RESTART IDENTITY CASCADE');

  // Get item ids
  let items = await knex<Item>('item')
    .select()
    .where('is_standalone', '=', true);
  console.log(items);

  // Get modgroup ids
  let modgroups = await knex<Modgroup>('modgroup').select();

  console.log(modgroups);

  let pairings: number[][];

  let modgroupIDs: number[];
  let pickMods: string[];
  let selectedItems: number[];
  let pickItems: string[];
  let itemIDs: number[];
  let displayOrder = 0;
  let pairedObjects: ItemXModgroup[];

  let knexResultIDs: (number| undefined) []

  // Omelettes
  pickMods = ['Salt'];
  pickItems = [
    'Ham & Cheese Omelette',
    'Avocado Cheese Omelette',
    'Cheese Omelette',
  ];
  knexResultIDs = await knex<Modgroup>('modgroup')
    .select()
    .whereIn('name', pickMods)
    .pluck('mod_id');
  assertDefinedArray(knexResultIDs);
  modgroupIDs = knexResultIDs;
  knexResultIDs = await knex<Item>('item')
    .select()
    .where('is_standalone', '=', true)
    .whereIn('name', pickItems)
    .pluck('item_id');
  assertDefinedArray(knexResultIDs);
  itemIDs = knexResultIDs;
  pairings = cartesianProduct(modgroupIDs)(itemIDs);
  pairedObjects = pairings.map((x) => ({
    mod_id: x[0],
    item_id: x[1],
    item_is_standalone: true,
    display_order: displayOrder++,
  }));
  await knex<ItemXModgroup>('item_X_modgroup').insert(pairedObjects);

  // Pancakes
  pickMods = ['Select Butter', 'Choose a topping'];
  pickItems = ['Buckwheat Pancake', 'Wheat Pancake'];
  knexResultIDs = await knex<Modgroup>('modgroup')
    .select()
    .whereIn('name', pickMods)
    .pluck('mod_id');
  assertDefinedArray(knexResultIDs);
  modgroupIDs = knexResultIDs;
  knexResultIDs = await knex<Item>('item')
    .select()
    .where('is_standalone', '=', true)
    .whereIn('name', pickItems)
    .pluck('item_id');
  assertDefinedArray(knexResultIDs);
  itemIDs = knexResultIDs;
  pairings = cartesianProduct(modgroupIDs)(itemIDs);
  pairedObjects = pairings.map((x) => ({
    mod_id: x[0],
    item_id: x[1],
    item_is_standalone: true,
    display_order: displayOrder++,
  }));
  await knex<ItemXModgroup>('item_X_modgroup').insert(pairedObjects);
}

function cartesianProduct<T>(as: T[]) {
  return function curriedCartesianProduct(bs: T[]) {
    return as.flatMap((a) => bs.map((b) => [a, b]));
  };
}
