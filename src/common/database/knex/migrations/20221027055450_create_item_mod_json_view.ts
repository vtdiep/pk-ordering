import { Knex } from 'knex';
import { ItemModsJSON } from '../../entities/ItemModsJSON.entity';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createView('item_mods_json', (view) => {
    view.columns(['item_id', 'mods', 'mod_ids']);
    view.as(
      knex
        .select<any, ItemModsJSON>([
          'mods.item_id',
          knex.raw("jsonb_agg(to_jsonb(mods) - 'item_id') as mods"),
          knex.raw('array_agg(mod_id) as mod_ids'),
        ])
        .from('mods')
        .groupBy('item_id')
        .orderBy('item_id'),
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropViewIfExists('item_mods_json');
}
