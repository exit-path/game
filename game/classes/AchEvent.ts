import lib from "swf-lib";

export class AchEvent extends lib.flash.events.Event {
  public declare achNum: number;

  public declare msg: string;

  public static readonly SEND: string = "sendr";

  public constructor(type: string, num: number) {
    super(type, true, false);
    this.achNum = num;
  }

  public clone(): lib.flash.events.Event {
    return new AchEvent(this.type, this.achNum);
  }

  public toString(): string {
    return this.formatToString(
      "AchEvent",
      "type",
      "bubbles",
      "cancelable",
      "eventPhase"
    );
  }
}
