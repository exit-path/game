import lib from "swf-lib";

export class w_beacon_161 extends lib.flash.display.MovieClip {
  public declare beacon: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1);
  }

  public frame1(): any {
    this.stop();
  }
}
