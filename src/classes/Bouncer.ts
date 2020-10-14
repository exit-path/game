import lib from "swf-lib";

export class Bouncer extends lib.flash.display.MovieClip {
  public declare bounces: number;

  public constructor() {
    super();
    this.bounces = 0;
    this.addFrameScript(0, this.frame1);
    this.parent["createBouncer"](this);
  }

  public frame1(): any {
    this.stop();
  }
}
