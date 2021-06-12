import * as Knex from 'knex';
import { Item } from 'src/item/entities/item.entity';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';
/**
 * Seed for modgroup and modgroup_item tables
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE modgroup RESTART IDENTITY CASCADE');

  // Inserts seed entries

  let modgroups = [];
  let note = '';

  let options = [];
  // Omelettes
  modgroups.push({
    name: 'Salt',
    required_selection: 0,
    max_selection: 1,
    max_single_select: 1,
    free_selection: 1,
    private_note: '',
  });
  options.push([
    {
      name: 'No Salt',
      description: '',
      active: true,
      is_standalone: false,
      price: 0,
      private_note: '',
    },
  ]);

  // Pancake
  modgroups.push({
    name: 'Select Butter',
    required_selection: 0,
    max_selection: 1,
    max_single_select: 1,
    free_selection: 1,
    private_note: note,
  });
  options.push([
    {
      name: 'Butter',
      description: 'Comes from cows',
      active: true,
      price: 2.5,
      private_note: '',
    },
    { name: 'Margarine', description: 'Slightly sweet', price: 2.5 },
  ]);

  modgroups.push({
    name: 'Choose a topping',
    required_selection: 0,
    max_selection: 3,
    max_single_select: 3,
    free_selection: 1,
    price: 1,
    description: '',
    private_note: '5/10/21',
  });
  options.push([
    {
      name: 'Strawberries',
      description: 'Red',
      active: true,
      price: 2.5,
      private_note: '',
    },
    { name: 'Blueberries', description: 'Blue', active: true, price: 2.5 },
    { name: 'Syrup', description: 'Sweet', active: true, price: 2.5 },
    { name: 'Honey', description: 'Naturally sweet', price: 2.5 },
  ]);

  // Eggs
  // modgroups.push(
  //     { name: "Strawberries", description: "Red", active: true, price: 2.50, private_note: "" },
  //     { name: "Blueberries", description: "Blue", active: true, price: 2.50 },
  //     { name: "Syrup", description: "Sweet", active: true, price: 2.50 },
  //     { name: "Honey", description: "Naturally sweet", price: 2.50 }
  // );

  // Burgers
  // modgroups.push(
  //     { name: "Strawberries", description: "Red", active: true, price: 2.50, private_note: "" },
  //     { name: "Blueberries", description: "Blue", active: true, price: 2.50 },
  //     { name: "Syrup", description: "Sweet", active: true, price: 2.50 },
  //     { name: "Honey", description: "Naturally sweet", price: 2.50 }
  // );

  // Fries & Sides
  // modgroups.push(
  //     { name: "Strawberries", description: "Red", active: true, price: 2.50, private_note: "" },
  //     { name: "Blueberries", description: "Blue", active: true, price: 2.50 },
  //     { name: "Syrup", description: "Sweet", active: true, price: 2.50 },
  //     { name: "Honey", description: "Naturally sweet", price: 2.50 }
  // );

  // Insert into tables

  let mod_ids = await knex<Modgroup>('modgroup').insert(modgroups, 'mod_id');

  for (let i = 0; i < mod_ids.length; i++) {
    let mod_id = mod_ids[i];
    let mod_item = options.shift();
    let display_order = 0;
    let item_ids = await knex<Item>('item').insert(mod_item, 'item_id');

    for (let j = 0; j < item_ids.length; j++) {
      await knex('modgroup_item').insert([
        {
          mod_id,
          item_id: item_ids[j],
          item_is_standalone: false,
          display_order: display_order++,
        },
      ]);
    }
  }

  // results = await knex("item").insert([
  //     { name: "Butter", description: "Comes from cows", active: true, price: 2.50, private_note: "" },
  //     { name: "Margarine", description: "Slightly sweet", price: 2.50 }
  // ], ['item_id']);

  // await knex("modgroup").insert(modgroups)

  // // Pancakes
  // note = "Pancakes\n"
  // modgroups = []
  // modgroups.push(
  //     {name: "Select Butter", required_selection: 0, max_selection: 1, max_single_select: 1, free_selection:1, private_note: note},
  //     {name: "Select Pancake Toppings", required_selection: 0, max_selection: 3, max_single_select: 3, free_selection:1,
  //         price: 1, description: "", private_note: note}

  // );

  // // Omelettes
  //     // { name: "Ham & Cheese Omelette", is_standalone: true, price: 5 },
  //     // { name: "Avocado Cheese Omelette", is_standalone: true,  price: 5 },
  //     // { name: "Cheese Omelette", is_standalone: true, price: 3 },
  //     // // Pancakes
  //     // { name: "Buckwheat Pancake", description: "Nutty", active: true, is_standalone: true, price: 2.50, private_note: "Expected shortage of buckwheat for Spring" },
  //     // { name: "Wheat Pancake", description: "Slightly sweet", is_standalone: true, price: 2.50 },
  //     // // Eggs
  //     // { name: "Eggs Over-Easy", active: true, is_standalone: true, price: 3 },
  //     // { name: "Scrambled Eggs", active: true, is_standalone: true, price: 3, description: "2 eggs" },
  //     // { name: "Sicilian Style Eggs", is_standalone: true, price: 3 },
  //     // { name: "Sunny-side Up", is_standalone: true, price: 3 },
  //     // // Burgers
  //     // { name: "Classic", description: "Bun, tomato, beef patty", active: true, is_standalone: true, price: 5 },
  //     // { name: "Cheeseburger", description: "Classic with a slice of cheese", active: true, is_standalone: true, price: 6 },
  //     // { name: "Portabella Burger", description: "Mushroom alternative", active: true, is_standalone: true, price: 6 },
  //     // // Fries & Sides
  //     // { name: "French Fries (S)", description: "Crisp and made to order", active: true, is_standalone: true, price: 3 },
  //     // { name: "French Fries (L)", description: "Crisp and made to order. Large", active: true, is_standalone: true, price: 4 },
  //     // { name: "Potato Wedges", description: "", active: false, is_standalone: true, price: 4 },
  //     // { name: "Tater Tots", description: "Good with sauce, Good on their own!", active: true, is_standalone: true, price: 3 },
  //     // { name: "Mac n' Cheese", description: "Double cheesey macaroni", active: true, is_standalone: true, price: 3 },
}
