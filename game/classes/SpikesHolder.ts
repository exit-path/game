import lib from "swf-lib";

export class SpikesHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createSpike"](this);
  }
}
