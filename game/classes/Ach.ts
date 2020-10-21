export class Ach {
  public declare achName: string;

  public declare description: string;

  public declare got: boolean;

  public constructor(aName: string, desc: string) {
    this.got = false;
    this.achName = aName;
    this.description = desc;
  }
}
