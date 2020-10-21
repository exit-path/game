import lib from "swf-lib";
import { Anim } from "./john/Anim";
import { Skin } from "./Skin";

interface YouArrowPlayer extends lib.flash.display.MovieClip {
  userName: string;
  colour: number;
}

export class YouArrow extends lib.flash.display.MovieClip {
  public declare lilArrow: lib.flash.display.MovieClip;

  public declare nameOf: lib.flash.text.TextField;

  public declare playerData: YouArrowPlayer;

  public declare skin: Skin;

  public constructor(mov: Skin, mov2: YouArrowPlayer) {
    super();
    this.skin = mov;
    this.playerData = mov2;
    this.nameOf.text = this.playerData["userName"];
    Anim.colourMe(this.lilArrow, this.playerData.colour);
  }
}
