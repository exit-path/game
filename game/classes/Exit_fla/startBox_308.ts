import lib from "swf-lib";
import { Relay } from "../john/Relay";

export class startBox_308 extends lib.flash.display.MovieClip {
  public declare levelName: lib.flash.display.MovieClipT<{
    nameOf: lib.flash.text.TextField;
  }>;

  public constructor() {
    super();
    this.addFrameScript(
      0,
      this.frame1,
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
  }

  frame1() {
    setTimeout(
      this.stage.__withContext(() => this.gotoAndPlay(20)),
      4000
    );
    setTimeout(
      this.stage.__withContext(() => this.gotoAndPlay(36)),
      5000
    );
    setTimeout(
      this.stage.__withContext(() => this.gotoAndPlay(55)),
      6000
    );
  }

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
