import lib from "swf-lib";

export class ColorPickerEvent extends lib.flash.events.Event {
  protected declare _color: number;

  public static readonly CHANGE: string = "change";

  public static readonly ENTER: string = "enter";

  public static readonly ITEM_ROLL_OUT: string = "itemRollOut";

  public static readonly ITEM_ROLL_OVER: string = "itemRollOver";

  public constructor(param1: string, param2: number) {
    super(param1, true);
    this._color = param2;
  }

  public clone(): lib.flash.events.Event {
    return new ColorPickerEvent(this.type, this.color);
  }

  public get color(): number {
    return this._color;
  }

  public toString(): string {
    return this.formatToString(
      "ColorPickerEvent",
      "type",
      "bubbles",
      "cancelable",
      "color"
    );
  }
}
