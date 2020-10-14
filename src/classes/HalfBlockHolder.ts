import lib from "swf-lib";

export class HalfBlockHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createHalfBlock"](this);
  }
}
