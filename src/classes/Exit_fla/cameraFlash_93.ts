import lib from "swf-lib";

export class cameraFlash_93 extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(1, this.frame2);
  }

  public frame2(): any {
    this.stop();
  }
}
