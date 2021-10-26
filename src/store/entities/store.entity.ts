/* eslint-disable max-classes-per-file */
export class StoreCategoryItemRef {
  cxi_do: number;

  item_id: number;
}

export class StoreCategory {
  items: StoreCategoryItemRef[];

  category_id: number;

  category_name: string | null;

  category_active: boolean;

  category_description: string | null;

  mxc_display_order: number;
}

export class StoreMenu {
  menu_id: number;

  menu_name: string | null;

  menu_display_order: number;

  menu_description: string | null;

  category: StoreCategory[];
}

export class StoreItem {
  item_id: number;

  name: string;

  description: string | null;

  price: string | null;
}

export class StoreData {
  data: {
    menus: StoreMenu[];
    items: StoreItem[];
  };
}
