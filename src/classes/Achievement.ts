import lib from "swf-lib";

export class Achievement extends lib.flash.display.MovieClip {
  public declare ach: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.addFrameScript(102, this.frame103);
  }

  public frame103(): any {
    this.parent["killAch"](this);
  }
}
