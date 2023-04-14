import lib from "swf-lib";

export class Bouncer extends lib.flash.display.MovieClip {
  public declare bounces: number;

  public declare bouncyness: number;

  public constructor() {
    super();
    this.bounces = 0;
    var tmp = +this.name;
    this.bouncyness = !isNaN(tmp) ? tmp : 1;
    this.addFrameScript(0, this.frame1);
    this.parent["createBouncer"](this);
  }

  public frame1(): any {
    this.stop();
  }
}
