import lib from "swf-lib";
import { Relay } from "../john/Relay";

export class ag_intro_mc_459 extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(0, this.frame1, 309, this.frame310);
  }

  public frame1(): any {
    if (process.env.NODE_ENV !== "production") {
      this.gotoAndPlay(300);
      return;
    }
    this.gotoAndPlay(2);
  }

  public frame310(): any {
    this.stop();
    this.dispatchEvent(new Relay(Relay.GOTO, "endIntro", " "));
  }
}
