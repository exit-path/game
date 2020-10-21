import lib from "swf-lib";

export class cautionSign_anim_444 extends lib.flash.display.MovieClip {
  public declare signsTot: lib.flash.text.TextField;

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1, 19, this.frame20);
  }

  public frame1(): any {
    this.stop();
  }

  public frame20(): any {
    this.stop();
  }
}
