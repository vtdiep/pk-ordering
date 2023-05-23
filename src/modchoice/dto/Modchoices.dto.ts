import { Choices } from 'src/common/database/entities/Choices.entity';
import { Expose, Type } from 'class-transformer';
import { ChoicesJSON } from 'src/common/database/entities/ChoicesJSON.entity';
import { ChoicesDTO } from './Choices.dto';

export class ModchoicesDTO implements ChoicesJSON {
  mod_id: Choices['mod_id'];

  @Type(() => ChoicesDTO)
  choices: ChoicesDTO[];

  choice_ids: Choices['item_id'][];

  constructor(partial: Partial<ModchoicesDTO>) {
    Object.assign(this, partial);
  }
}

// type reference = ExpandRecursively<ChoicesJSON>
