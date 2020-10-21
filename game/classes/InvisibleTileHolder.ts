import lib from "swf-lib";

export class InvisibleTileHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createInvisibleBlock"](this);
  }
}
