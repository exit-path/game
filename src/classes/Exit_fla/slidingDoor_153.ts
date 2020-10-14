import lib from "swf-lib";

export class slidingDoor_153 extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(0, this.frame1, 24, this.frame25);
  }

  public frame1(): any {
    this.stop();
  }

  public frame25(): any {
    this.stop();
  }
}
