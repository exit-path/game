import lib from "swf-lib";
import { Anim } from "./john/Anim";

export class YouArrow extends lib.flash.display.MovieClip {
  public declare lilArrow: lib.flash.display.MovieClip;

  public declare nameOf: lib.flash.text.TextField;

  public declare playerData: lib.flash.display.MovieClip;

  public declare skin: lib.flash.display.MovieClip;

  public constructor(
    mov: lib.flash.display.MovieClip,
    mov2: lib.flash.display.MovieClip
  ) {
    super();
    this.skin = mov;
    this.playerData = mov2;
    this.nameOf.text = this.playerData["userName"];
    Anim.colourMe(this.lilArrow, this.playerData.colour);
  }
}
