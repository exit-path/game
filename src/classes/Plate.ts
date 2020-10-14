import lib from "swf-lib";

export class Plate extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(0, this.frame1);
    this.parent["createPlate"](this);
  }

  public frame1(): any {
    this.stop();
  }
}
