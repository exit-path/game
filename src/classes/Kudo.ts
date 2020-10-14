import lib from "swf-lib";

export class Kudo extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(14, this.frame15);
  }

  public frame15(): any {
    this.stop();
  }
}
