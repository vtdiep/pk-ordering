import { ModData } from './ModData';
import { ModchoicesDTO } from './ModchoicesDTO';

export class ItemModalCardProps {
  modchoices: ModchoicesDTO;
  children?: React.ReactNode;
  modData?: ModData;
}
