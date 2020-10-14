import lib from "swf-lib";

export class ComponentEvent extends lib.flash.events.Event {
  public static readonly BUTTON_DOWN: string = "buttonDown";

  public static readonly ENTER: string = "enter";

  public static readonly HIDE: string = "hide";

  public static readonly LABEL_CHANGE: string = "labelChange";

  public static readonly MOVE: string = "move";

  public static readonly RESIZE: string = "resize";

  public static readonly SHOW: string = "show";

  public constructor(
    param1: string,
    param2: boolean = false,
    param3: boolean = false
  ) {
    super(param1, param2, param3);
  }

  public clone(): lib.flash.events.Event {
    return new ComponentEvent(this.type, this.bubbles, this.cancelable);
  }

  public toString(): string {
    return this.formatToString(
      "ComponentEvent",
      "type",
      "bubbles",
      "cancelable"
    );
  }
}
