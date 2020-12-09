import lib from "swf-lib";
import { CameraFlashSingular } from "./CameraFlashSingular";
import type { Game } from "./Game";

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
    if ((this.parent as Game).levelNum < 100) {
      this.x = 0 - this.parent.x / 10;
    } else {
      this.x = 0 - this.parent.x;
      this.y = 0 - this.parent.y;
    }
    if (this.currentFrame == 3) {
      this.cA.ping();
      this.cB.ping();
    }
  }
}
