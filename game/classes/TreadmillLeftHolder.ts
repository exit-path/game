import lib from "swf-lib";

export class TreadmillLeftHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createTreadmillBlock"](this, "L");
  }
}
