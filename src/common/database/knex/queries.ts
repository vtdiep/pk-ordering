import { Knex } from 'knex';
import { Choices } from '../entities/Choices.entity';
import { ChoicesJSON } from '../entities/ChoicesJSON.entity';

export const getChoices = (knex: Knex) =>
  knex
    .select<any, Choices>([
      'mi.mod_id',
      'mi.price as mi_price',
      'mi.display_order',
      'i.*',
    ])
    .from('modgroup_item as mi')
    .join('item as i', function on() {
      this.on('mi.item_id', '=', 'i.item_id');
    })
    .orderBy('display_order', 'asc')
    .orderBy('item_id', 'asc');

export const getChoicesForItem = (knex: Knex, item_id: number) =>
  getChoices(knex).whereIn(
    'mi.mod_id',
    knex.select('mod_id').from('mods').where('item_id', item_id),
  );

export const jsonChoices = (
  knex: Knex,
  item_id?: number,
): Knex.QueryBuilder<any, [ChoicesJSON]> =>
  knex
    .select<any, ChoicesJSON>([
      'sc.mod_id',
      knex.raw("jsonb_agg(to_jsonb(sc) - 'mod_id') as choices"),
      knex.raw('array_agg(item_id) as choice_ids'),
    ])
    .modify((qb) => {
      if (item_id) {
        qb.from(getChoicesForItem(knex, item_id).as('sc'));
      } else {
        console.log('aa');

        qb.from(getChoices(knex).as('sc'));
      }
    })
    .groupBy('mod_id')
    .orderBy('mod_id', 'asc')
