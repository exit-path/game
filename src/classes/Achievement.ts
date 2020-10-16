import lib from "swf-lib";
import { Exit_fla } from ".";

export class Achievement extends lib.flash.display.MovieClip {
  public declare ach: lib.flash.display.MovieClipT<{
    box: lib.flash.display.MovieClipT<{
      head: Exit_fla.runner_head_17;
      head2: Exit_fla.runner_head_17;
      handGear: Exit_fla.handStuffcopy_57;
    }>;
    achTitle: lib.flash.text.TextField;
  }>;

  public constructor() {
    super();
    this.addFrameScript(102, this.frame103);
  }

  public frame103(): any {
    this.parent["killAch"](this);
  }
}
