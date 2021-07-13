// note that price string may contain '$' due to database money type
export class OrderItemDataEntity {
  item_id: number;

  item_name: string;

  item_price: string;

  item_active: boolean;

  mods: number[];
}
