import lib from "swf-lib";
import { Skin } from "./Skin";

let isBeamVisible = localStorage.isBeamVisible !== "false";
export class Beam extends lib.flash.display.Shape {
  static get isVisible() {
    return isBeamVisible;
  }
  static set isVisible(value: boolean) {
    isBeamVisible = value;
    localStorage.isBeamVisible = String(value);
  }
}

export class Runner extends Skin {
  public declare body: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1);
  }

  public frame1(): any {
    this.stop();
  }
}
