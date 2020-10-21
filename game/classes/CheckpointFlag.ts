import lib from "swf-lib";

export class CheckpointFlag extends lib.flash.display.MovieClip {
  public declare flag: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.addFrameScript(10, this.frame11);
  }

  public frame11(): any {
    this.stop();
  }
}
