import lib from "swf-lib";
import { Level } from "./Level";
import { TickerWord } from "./TickerWord";

export class Level3 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare sign: lib.flash.display.MovieClipT<{
    TICKERAB: TickerWord;
  }>;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {
    this.sign.TICKERAB.changeString(this.parent["playerObject"].gameName);
    this.addChild(this.sign);
  }

  public uniqueLevelPing(): any {}
}
