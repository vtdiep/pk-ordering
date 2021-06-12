import { IsInt } from 'class-validator';


export class OrderDetailModDto {
  @IsInt()
  id: number;
}
