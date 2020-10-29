import lib from "swf-lib";
import { Exit_fla } from ".";

export class LevelStart extends lib.flash.display.MovieClip {
  public declare startBox: Exit_fla.startBox_308;

  public constructor(isMP: boolean) {
    super();
    this.startBox.stopAtStep = isMP;
  }
}
