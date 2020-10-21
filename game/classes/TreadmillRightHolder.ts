import lib from "swf-lib";

export class TreadmillRightHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createTreadmillBlock"](this, "R");
  }
}
