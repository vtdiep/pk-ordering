/* eslint-disable no-plusplus */
import { Knex } from 'knex';
import { Item } from 'src/item/entities/item.entity';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';
/**
 * Seed for modgroup and modgroup_item tables
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE modgroup RESTART IDENTITY CASCADE');

  // Inserts seed entries
  type ModgroupOption = Omit<Item, 'is_standalone'> & { is_standalone: false };

  type DataObj = {
    modgroup: Modgroup;
    options: ModgroupOption[];
  };

  let note = '';

  let pairs: DataObj[] = [];

  // Omelettes
  pairs.push({
    modgroup: {
      name: 'Salt',
      required_selection: 0,
      max_selection: 1,
      max_single_select: 1,
      free_selection: 1,
      private_note: '',
    },
    options: [
      {
        name: 'No Salt',
        description: '',
        active: true,
        is_standalone: false,
        price: 0,
        private_note: '',
      },
    ],
  });

  // Pancake
  pairs.push({
    modgroup: {
      name: 'Select Butter',
      required_selection: 0,
      max_selection: 1,
      max_single_select: 1,
      free_selection: 1,
      private_note: note,
    },
    options: [
      {
        name: 'Butter',
        description: 'Comes from cows',
        active: true,
        is_standalone: false,
        price: 2.5,
        private_note: '',
      },
      {
        name: 'Margarine',
        description: 'Slightly sweet',
        is_standalone: false,
        price: 2.5,
      },
    ],
  });

  pairs.push({
    modgroup: {
      name: 'Choose a topping',
      required_selection: 0,
      max_selection: 3,
      max_single_select: 3,
      free_selection: 1,
      price: 1,
      description: '',
      private_note: '5/10/21',
    },
    options: [
      {
        name: 'Strawberries',
        description: 'Red',
        active: true,
        is_standalone: false,
        price: 2.5,
        private_note: '',
      },
      {
        name: 'Blueberries',
        description: 'Blue',
        active: true,
        is_standalone: false,
        price: 2.5,
      },
      {
        name: 'Syrup',
        description: 'Sweet',
        active: true,
        is_standalone: false,
        price: 2.5,
      },
      {
        name: 'Honey',
        description: 'Naturally sweet',
        is_standalone: false,
        price: 2.5,
      },
    ],
  });

  // Insert into tables

  let mods = pairs.map((x) => x.modgroup);
  let opts = pairs.map((x) => x.options);

  let mids = await knex<Modgroup>('modgroup').insert(mods, 'mod_id');
  let oids = await knex<Item>('item').insert(opts.flat(), 'item_id');

  // build pairs of [mod_id, option_id] grouped by mod_id
  // ie:
  // [
  //    [[mod_id, option_id], [mod_id, option_id2]],
  //    [[mod_id2, oid3], [mod_id2, oid4]]
  // ]
  let idPairs = pairs.map((pair, i) => {
    let idPair = pair.options.map(() => [
      mids[i].mod_id,
      oids.shift()?.item_id,
    ]);
    return idPair;
  });

  let modgroupOptions = idPairs
    .map((arrayOfPairsByModId) => {
      let modgroupOption = arrayOfPairsByModId.map((pair, i) => ({
        mod_id: pair[0],
        item_id: pair[1],
        display_order: i,
      }));
      return modgroupOption;
    })
    .flat();

  await knex('modgroup_item').insert(modgroupOptions);
}
