export class JSONToken {
  private declare _type: number;

  private declare _value: any;

  public constructor(type: number = -1, value: any = null) {
    this._type = type;
    this._value = value;
  }

  public get type(): number {
    return this._type;
  }

  public set type(value: number) {
    this._type = value;
  }

  public get value(): any {
    return this._value;
  }

  public set value(v: any) {
    this._value = v;
  }
}
