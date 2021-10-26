import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../common/constants';
import {
  StoreCategory,
  StoreData,
  StoreCategoryItemRef,
  StoreMenu,
} from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(@Inject(KNEX_CONNECTION) private knex: Knex) {}

  async findAll() {
    let res = await this.knex
      .with('citem', (qb) => {
        qb.select<any, StoreCategoryItemRef>([
          'cxi.category_id',
          'cxi.item_id',
          this.knex.raw('cxi.display_order as cxi_do'),
        ]).from('category_X_item as cxi');
      })
      .with('catitem', (qb) => {
        qb.select<
          any,
          Omit<StoreCategory, 'menu_id_menu' | 'mxc_display_order'>
        >([
          'c.category_id',
          this.knex.raw('c.name as category_name'),
          this.knex.raw('c.description as category_description'),
          this.knex.raw('c.active as category_active'),
          this.knex.raw("json_agg(to_jsonb(citem) - 'category_id') as items"),
        ])
          .from('citem')
          .join('category as c', 'citem.category_id', 'c.category_id')
          .groupBy(['c.category_id']);
      })
      .with('menucatitem', (qb) => {
        qb.select<any, StoreCategory>([
          'c.*',
          'mxc.menu_id_menu',
          this.knex.raw('mxc.display_order as mxc_display_order'),
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
          this.knex.raw(
            "json_agg(to_jsonb(row_to_json(menucatitem)) - 'menu_id_menu') as category",
          ),
        ])
          .from('menucatitem')
          .join('menu', 'menu.menu_id', 'menucatitem.menu_id_menu')
          .groupBy(['menu_id']);
      })
      .with('menus', (qb) => {
        qb.select(this.knex.raw('json_agg(row_to_json(menu)) as menus')).from(
          'menu',
        );
      })
      .with('items', (qb) => {
        qb.select([
          'item.item_id',
          'item.name',
          'item.description',
          'item.price',
        ])
          .from('item')
          .where('item.active', true)
          .where('item.is_standalone', true);
      })
      .select<any, StoreData>(
        this.knex.raw(
          "json_build_object('menus', (SELECT * from menus), 'items', (select json_agg( row_to_json(items)) from items)) as data",
        ),
      );
    console.log(res);
    return res;
  }
}
