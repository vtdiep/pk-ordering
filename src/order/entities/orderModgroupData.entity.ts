// import { modgroup } from "@prisma/client";

export class OrderModgroupDataEntity {
  [modgroupId: number]: ModgroupS;
}

// override price type from Prisma.decimal to string for knex
export type ModgroupS = {
  mod_id: number;
  name: string;
  required_selection: number;
  max_selection: number;
  max_single_select: number;
  free_selection: number;
  price: string;
  description: string | null;
  private_note: string | null;
};
