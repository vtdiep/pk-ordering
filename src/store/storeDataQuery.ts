import { Knex, knex } from 'knex';
import {
  StoreCategory,
  StoreData,
  StoreCategoryItemRef,
  StoreMenu,
} from './entities/store.entity';

export function getStoreDataQuery(knexConnectionParam?: Knex) {
  let knexConnection: Knex;

  if (!knexConnectionParam) {
    knexConnection = knex({ client: 'pg' });
  } else {
    knexConnection = knexConnectionParam;
  }
  return knexConnection
    .with('citem', (qb) => {
      qb.select<any, StoreCategoryItemRef>([
        'cxi.category_id',
        'cxi.item_id',
        knexConnection.raw('cxi.display_order as cxi_do'),
      ]).from('category_X_item as cxi');
    })
    .with('catitem', (qb) => {
      qb.select<any, Omit<StoreCategory, 'menu_id_menu' | 'mxc_display_order'>>(
        [
          'c.category_id',
          knexConnection.raw('c.name as category_name'),
          knexConnection.raw('c.description as category_description'),
          knexConnection.raw('c.active as category_active'),
          knexConnection.raw(
            "json_agg(to_jsonb(citem) - 'category_id') as items",
          ),
        ],
      )
        .from('citem')
        .join('category as c', 'citem.category_id', 'c.category_id')
        .groupBy(['c.category_id']);
    })
    .with('menucatitem', (qb) => {
      qb.select<any, StoreCategory>([
        'c.*',
        'mxc.menu_id_menu',
        knexConnection.raw('mxc.display_order as mxc_display_order'),
      ])
        .from('catitem as c')
        .join(
          'menu_X_category as mxc',
          'c.category_id',
          'mxc.category_id_category',
        );
    })
    .with('menu', (qb) => {
      qb.select<any, StoreMenu>([
        'menu.menu_id',
        'menu.name as menu_name',
        'menu.display_order as menu_display_order',
        'menu.active as menu_active',
        'menu.description as menu_description',
        knexConnection.raw(
          "json_agg(to_jsonb(row_to_json(menucatitem)) - 'menu_id_menu') as category",
        ),
      ])
        .from('menucatitem')
        .join('menu', 'menu.menu_id', 'menucatitem.menu_id_menu')
        .groupBy(['menu_id']);
    })
    .with('menus', (qb) => {
      qb.select(
        knexConnection.raw('json_agg(row_to_json(menu)) as menus'),
      ).from('menu');
    })
    .with('items', (qb) => {
      qb.select(['item.item_id', 'item.name', 'item.description', 'item.price'])
        .from('item')
        .where('item.active', true)
        .where('item.is_standalone', true);
    })
    .select<any, StoreData>(
      knexConnection.raw(
        "json_build_object('menus', (SELECT * from menus), 'items', (select json_agg( row_to_json(items)) from items)) as data",
      ),
    )
    .first();
}
