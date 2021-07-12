export class ModError {
  mod_id: number;

  modname: string;

  modErr: string[];

  constructor(mod_id: number, modname: string, modErr: string[] = []) {
    this.mod_id = mod_id;
    this.modname = modname;
    this.modErr = modErr;
  }
}
