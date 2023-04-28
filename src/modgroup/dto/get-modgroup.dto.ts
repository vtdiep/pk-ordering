import { Exclude } from 'class-transformer';
import { ModgroupBaseEntity } from '../entities/modgroup.entity';

export class GetModgroupDTO extends ModgroupBaseEntity {
  @Exclude()
  private_note?: string | null;

  constructor(partial: Partial<ModgroupBaseEntity>) {
    super();
    Object.assign(this, partial);
  }
}
