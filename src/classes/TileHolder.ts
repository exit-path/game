import lib from "swf-lib";

export class TileHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createTile"](this);
  }
}
