import lib from "swf-lib";

export class CheckpointHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["addCheckpoint"](this);
  }
}
