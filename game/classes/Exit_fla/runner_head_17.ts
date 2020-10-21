import lib from "swf-lib";

export class runner_head_17 extends lib.flash.display.MovieClip {
  public declare hat: lib.flash.display.MovieClip;

  public declare o: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1);
  }

  public frame1(): any {
    this.stop();
  }
}
