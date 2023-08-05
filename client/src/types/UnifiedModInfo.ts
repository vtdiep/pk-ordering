import { ModData } from './ModData';
import { Choices } from './Modifiers';

export type UnifiedModInfo = ModData & {
  choices?: Choices[];
};
