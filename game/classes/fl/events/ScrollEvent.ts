import lib from "swf-lib";

export class ScrollEvent extends lib.flash.events.Event {
  private declare _delta: number;

  private declare _direction: string;

  private declare _position: number;

  public static readonly SCROLL: string = "scroll";

  public constructor(param1: string, param2: number, param3: number) {
    super(ScrollEvent.SCROLL, false, false);
    this._direction = param1;
    this._delta = param2;
    this._position = param3;
  }

  public clone(): lib.flash.events.Event {
    return new ScrollEvent(this._direction, this._delta, this._position);
  }

  public get delta(): number {
    return this._delta;
  }

  public get direction(): string {
    return this._direction;
  }

  public get position(): number {
    return this._position;
  }

  public toString(): string {
    return this.formatToString(
      "ScrollEvent",
      "type",
      "bubbles",
      "cancelable",
      "direction",
      "delta",
      "position"
    );
  }
}
