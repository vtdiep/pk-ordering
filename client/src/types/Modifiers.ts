export interface Modifier {
  mod_id: number;
  choice_ids: number[];
  display_order: number;
  choices: (Pick<Modchoice, 'choice_id'> & { display_order: number })[];
}

export interface Modchoice {
  mod_id: number;
  name: string;
  price: string;
  choice_id: number;
  description: string;
}

export interface Choices {
  choice_id: number;

  name: string;

  description?: string | undefined;

  active?: boolean | undefined;

  is_standalone?: boolean | undefined;

  price?: number | undefined;

  private_note?: string | undefined;

  mi_price: number | null;

  display_order: number;
}
