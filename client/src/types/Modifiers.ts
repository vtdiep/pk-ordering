export interface Modifier {
  mod_id: number;
  choice_ids: number[];
  display_order: number;
  choices: (Pick<Modchoice, 'choice_id'> & { display_order: number })[];
}

export interface Modchoice {
  name: string;
  price: string;
  choice_id: number;
  description: string;
}
