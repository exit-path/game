import lib from "swf-lib";

export class FreedomSequence extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(634, this.frame635, 689, this.frame690);
  }

  public frame635(): any {
    this.parent.parent["endEnding"]();
  }

  public frame690(): any {
    this.parent["endEnding"]();
  }
}
