import lib from "swf-lib";
import { Skin } from "./Skin";

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
