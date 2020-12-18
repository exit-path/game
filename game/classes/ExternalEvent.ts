import lib from "swf-lib";

export type ExternalEventProps =
  | { type: "sp-user-level" }
  | { type: "connect-multiplayer" };

export class ExternalEvent extends lib.flash.events.Event {
  static readonly TYPE = "external-event";

  public constructor(readonly props: ExternalEventProps) {
    super(ExternalEvent.TYPE, true, false);
  }
}
