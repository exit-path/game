import lib from "swf-lib";

export class w_beaconC_228 extends lib.flash.display.MovieClip {
  public declare beacon: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1);
  }

  public frame1(): any {
    this.beacon.gotoAndPlay(Math.floor(Math.random() * 10));
  }
}
