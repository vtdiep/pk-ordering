// note that price string may contain '$' due to database money type
export class OrderModOptDataEntity {
  mod_id: number;

  item_id: number;

  modopt_price: string | null;

  modopt_name: string;

  item_price: string;

  item_active: boolean;

  mod_name: string;

  required_selection: number;

  max_selection: number;

  max_single_select: number;

  free_selection: number;

  mod_price: string;

  description: string | null;
}
