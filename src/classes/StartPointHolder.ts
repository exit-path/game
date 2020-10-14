import lib from "swf-lib";

export class StartPointHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createStartPoint"](this);
  }
}
