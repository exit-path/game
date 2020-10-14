import lib from "swf-lib";
import { CameraFlashSingular } from "./CameraFlashSingular";

export class UIBackground extends lib.flash.display.MovieClip {
  public declare cA: CameraFlashSingular;

  public declare cB: CameraFlashSingular;

  public constructor() {
    super();
  }

  public ping(): any {
    this.cA.ping();
    this.cB.ping();
  }
}
