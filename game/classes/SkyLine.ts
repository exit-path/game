import lib from "swf-lib";
import { CameraFlashSingular } from "./CameraFlashSingular";

export class SkyLine extends lib.flash.display.MovieClip {
  public declare cA: CameraFlashSingular;

  public declare cB: CameraFlashSingular;

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1);
  }

  public frame1(): any {
    this.stop();
  }

  public ping(): any {
    if (this.parent["singlePlayer"]) {
      this.x = 0 - this.parent.x / 10;
    } else {
      this.x = 0 - this.parent.x;
    }
    if (this.currentFrame == 3) {
      this.cA.ping();
      this.cB.ping();
    }
  }
}