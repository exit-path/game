import lib from "swf-lib";
import type { GamePlayerPosition } from "./Tubes";

export type ExternalEventProps =
  | { type: "sp-user-level" }
  | { type: "connect-multiplayer" }
  | { type: "disconnect-multiplayer" }
  | { type: "report-position"; position: GamePlayerPosition }
  | { type: "report-checkpoint"; id: number }
  | { type: "give-kudo"; targetId: string }
  | { type: "sp-menu-start" }
  | { type: "sp-menu-end" }
  | { type: "modify-start" }
  | { type: "modify-end" }
  | { type: "mp-game-init" }
  | { type: "mp-game-end" };

export class ExternalEvent extends lib.flash.events.Event {
  static readonly TYPE = "external-event";

  public constructor(readonly props: ExternalEventProps) {
    super(ExternalEvent.TYPE, true, false);
  }
}
