import lib from "swf-lib";

export class FadeOut extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.addFrameScript(0, this.frame1, 14, this.frame15, 29, this.frame30);
  }

  public frame1(): any {
    this.stop();
  }

  public frame15(): any {
    this.parent["loadNextSinglePlayerLevel"]();
  }

  public frame30(): any {
    this.parent["endFadeOut"](this);
  }
}
