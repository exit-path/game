import lib from "swf-lib";

export class CheckpointFlag extends lib.flash.display.MovieClip {
  public declare flag: lib.flash.display.MovieClip;

  readonly flagMask: lib.flash.display.DisplayObject;

  public constructor() {
    super();
    this.addFrameScript(10, this.frame11);
    this.flagMask = this.flag.getChildByName("mask");
    for (let i = 0; i < this.flag.numChildren; i++) {
      this.flag.getChildAt(i).mask = null;
    }
  }

  public frame11(): any {
    this.stop();
  }

  public ping(): void {
    if (this.stage == null) {
      return;
    }
    const isHighQuality = this.stage.quality === "HIGH";
    this.flag.mask = isHighQuality ? this.flagMask : null;
    this.flagMask.visible = isHighQuality;
  }
}
