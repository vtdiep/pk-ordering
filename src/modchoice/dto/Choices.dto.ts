import { Decimal } from '@prisma/client/runtime';
import { Exclude, Expose } from 'class-transformer';
import { Choices } from 'src/common/database/entities/Choices.entity';

export class ChoicesDTO implements Omit<Choices, 'mod_id'> {
  @Expose({ name: 'choice_id' })
  item_id: number;

  name: string;

  description?: string | undefined;

  active?: boolean | undefined;

  is_standalone?: boolean | undefined;

  price?: number | Decimal | undefined;

  private_note?: string | undefined;

  mi_price: Decimal | null;

  display_order: number;

  constructor(partial: Partial<ChoicesDTO>) {
    // super()
    Object.assign(this, partial);
  }
}
