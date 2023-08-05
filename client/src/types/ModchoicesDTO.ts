import { Choices, Modchoice } from './Modifiers';

export class ModchoicesDTO {
  mod_id: Modchoice['mod_id'];

  choices: Choices[];

  choice_ids: Choices['choice_id'][];
}
