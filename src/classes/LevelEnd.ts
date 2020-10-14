import lib from "swf-lib";
import { Relay } from "./john/Relay";

export class LevelEnd extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(78, this.frame79);
  }

  public frame79(): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "LevelEnd", "Lobby"));
  }
}
