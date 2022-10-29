import { Choices } from './Choices.entity';

export class ChoicesJSON {
  mod_id: Choices['mod_id'];

  choices: Array<Omit<Choices, 'mod_id'>>;

  choice_ids: Choices['item_id'][];
}

// type reference = ExpandRecursively<ChoicesJSON>
