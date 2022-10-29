import { Knex } from 'knex';
import { Mods } from '../../entities/Mods.entity';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createView('mods', (view) => {
    view.as(
      knex
        .select<any, Mods>(['item_id', 'ixm.display_order', 'm.*'])
        .from('item_X_modgroup as ixm')
        .join('modgroup as m', 'ixm.mod_id', 'm.mod_id')
        .orderBy('display_order'),
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropViewIfExists('mods');
}
