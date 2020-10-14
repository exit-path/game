import lib from "swf-lib";

export class HttpEvent extends lib.flash.events.Event {
  private declare evtType: string;

  public static readonly onHttpClose: string = "onHttpClose";

  public static readonly onHttpConnect: string = "onHttpConnect";

  public static readonly onHttpData: string = "onHttpData";

  public static readonly onHttpError: string = "onHttpError";

  public declare params: any;

  public constructor(type: string, params: any) {
    super(type);
    this.params = params;
    this.evtType = type;
  }

  public clone(): lib.flash.events.Event {
    return new HttpEvent(this.evtType, this.params);
  }

  public toString(): string {
    return this.formatToString(
      "HttpEvent",
      "type",
      "bubbles",
      "cancelable",
      "eventPhase",
      "params"
    );
  }
}
