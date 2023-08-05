export class ModData {
  mod_id?: number;

  name: string;

  required_selection: number;

  max_selection: number;

  max_single_select: number;

  free_selection: number;

  price?: number;

  description?: string | null;
}
