import lib from "swf-lib";
import { Relay } from "../john/Relay";

export class startBox_308 extends lib.flash.display.MovieClip {
  public declare levelName: lib.flash.display.MovieClipT<{
    nameOf: lib.flash.text.TextField;
  }>;

  private frameCounter = 0;

  public constructor() {
    super();
    this.addFrameScript(
      18,
      this.frame19,
      24,
      this.frame25,
      43,
      this.frame44,
      55,
      this.frame56,
      82,
      this.frame83
    );
    this.addEventListener(lib.flash.events.Event.ENTER_FRAME, this.ping);
  }

  ping = () => {
    const stage = this.stage;
    if (!stage) {
      return;
    }
    this.frameCounter++;
    if (this.frameCounter == 30 * 4) {
      this.gotoAndPlay(20);
    } else if (this.frameCounter == 30 * 5) {
      this.gotoAndPlay(36);
    } else if (this.frameCounter == 30 * 6) {
      this.gotoAndPlay(55);
      this.removeEventListener(lib.flash.events.Event.ENTER_FRAME, this.ping);
    }
  };

  public frame19(): any {
    this.stop();
  }

  public frame25(): any {
    this.stop();
  }

  public frame44(): any {
    this.stop();
  }

  public frame56(): any {
    this.dispatchEvent(new Relay(Relay.SEND, "StartBox", "go"));
  }

  public frame83(): any {
    this.stop();
  }
}
