import lib from "swf-lib";
import { Math2 } from "./john/Math2";

export class CameraFlashSingular extends lib.flash.display.MovieClip {
  public declare cameraFlash: lib.flash.display.MovieClip;

  public declare counter: number;

  public declare goal: number;

  public constructor() {
    super();
    this.goal = 0;
    this.counter = 0;
  }

  public ping(): any {
    this.counter++;
    this.x = 0 - this.parent.x;
    if (this.counter >= this.goal) {
      this.counter = 0;
      this.setGoal();
      this.cameraFlash.x = Math2.random(800);
      this.cameraFlash.rotation = Math2.random(360);
      this.cameraFlash.y = 300 + Math2.random(200);
      this.cameraFlash.play();
      return;
    }
  }

  public setGoal(): any {
    this.goal = Math2.random(20) + 5;
  }
}
