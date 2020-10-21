import lib from "swf-lib";

export class Relay extends lib.flash.events.Event {
  public static readonly ACH: string = "ach";

  public static readonly GOTO: string = "goto";

  public declare msg: string;

  public static readonly SEND: string = "send";

  public declare sender: string;

  public static readonly WARNING: string = "warning";

  public constructor(
    type: string,
    sendr: string = "unknown",
    messag: string = "no message"
  ) {
    super(type, true, false);
    this.sender = sendr;
    this.msg = messag;
  }

  public clone(): lib.flash.events.Event {
    return new Relay(this.type, this.sender, this.msg);
  }

  public toString(): string {
    return this.formatToString(
      "Relay",
      "type",
      "bubbles",
      "cancelable",
      "eventPhase"
    );
  }
}
