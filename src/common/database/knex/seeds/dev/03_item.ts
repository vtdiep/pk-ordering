import { Knex } from 'knex';
import { Item } from '../../../../../item/entities/item.entity';

export const OMELETTE_ITEMS: Item[] = [
  // Omelettes
  { name: 'Ham & Cheese Omelette', is_standalone: true, price: 5 },
  { name: 'Avocado Cheese Omelette', is_standalone: true, price: 5 },
  { name: 'Cheese Omelette', is_standalone: true, price: 3 },
];

export const PANCAKE_ITEMS: Item[] = [
  // Pancakes
  {
    name: 'Buckwheat Pancake',
    description: 'Nutty',
    active: true,
    is_standalone: true,
    price: 2.5,
    private_note: 'Expected shortage of buckwheat for Spring',
  },
  {
    name: 'Wheat Pancake',
    description: 'Slightly sweet',
    is_standalone: true,
    price: 2.5,
  },
];

export const EGG_ITEMS: Item[] = [
  // Eggs
  { name: 'Eggs Over-Easy', active: true, is_standalone: true, price: 3 },
  {
    name: 'Scrambled Eggs',
    active: true,
    is_standalone: true,
    price: 3,
    description: '2 eggs',
  },
  { name: 'Sicilian Style Eggs', is_standalone: true, price: 3 },
  { name: 'Sunny-side Up', is_standalone: true, price: 3 },
];

export const BURGER_ITEMS: Item[] = [
  // Burgers
  {
    name: 'Classic',
    description: 'Bun, tomato, beef patty',
    active: true,
    is_standalone: true,
    price: 5,
  },
  {
    name: 'Cheeseburger',
    description: 'Classic with a slice of cheese',
    active: true,
    is_standalone: true,
    price: 6,
  },
  {
    name: 'Portabella Burger',
    description: 'Mushroom alternative',
    active: true,
    is_standalone: true,
    price: 6,
  },
];

export const FRIES_SIDES_ITEMS: Item[] = [
  // Fries & Sides
  {
    name: 'French Fries (S)',
    description: 'Crisp and made to order',
    active: true,
    is_standalone: true,
    price: 3,
  },
  {
    name: 'French Fries (L)',
    description: 'Crisp and made to order. Large',
    active: true,
    is_standalone: true,
    price: 4,
  },
  {
    name: 'Potato Wedges',
    description: '',
    active: false,
    is_standalone: true,
    price: 4,
  },
  {
    name: 'Tater Tots',
    description: 'Good with sauce, Good on their own!',
    active: true,
    is_standalone: true,
    price: 3,
  },
  {
    name: "Mac n' Cheese",
    description: 'Double cheesey macaroni',
    active: true,
    is_standalone: true,
    price: 3,
  },
];

/**
 * Seed for item table
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE item RESTART IDENTITY CASCADE');

  // Inserts standalone items
  await knex('item').insert([
    ...OMELETTE_ITEMS,
    ...PANCAKE_ITEMS,
    ...EGG_ITEMS,
    ...BURGER_ITEMS,
    ...FRIES_SIDES_ITEMS,
  ]);
}
