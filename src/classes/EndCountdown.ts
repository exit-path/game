import lib from "swf-lib";
import { StopWatch } from "./john/StopWatch";
import { Relay } from "./john/Relay";

export class EndCountdown extends lib.flash.display.MovieClip {
  public declare timeOf: lib.flash.text.TextField;

  public declare timer: StopWatch;

  public declare user: string;

  public declare whoBeat: lib.flash.text.TextField;

  public constructor(str: string) {
    super();
    this.user = "bob";
    this.timer = new StopWatch();
    this.user = str;
    this.timer.initTimer();
    this.addEventListener(lib.flash.events.Event.ENTER_FRAME, this.counting);
    this.whoBeat.text = this.user + " just beat the level!";
  }

  public counting(e: lib.flash.events.Event = null): any {
    this.timeOf.text = String(15 - this.timer.getTimeAsSeconds());
  }

  public endNow(): any {
    this.timer.killTimer();
    this.dispatchEvent(new Relay(Relay.SEND, "EndCountdown", "End"));
  }

  public ping(xPos: number, yPos: number): any {
    this.x = xPos;
    this.y = yPos;
    if (15 - this.timer.getTimeAsSeconds() <= 0) {
      this.endNow();
    }
  }
}
