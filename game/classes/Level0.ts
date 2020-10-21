import lib from "swf-lib";
import { Level } from "./Level";
import { TickerWord } from "./TickerWord";
import { PopSpikes } from "./PopSpikes";
import { Teleporter } from "./Teleporter";

export class Level0 extends Level {
  public declare __1532: TickerWord;

  public declare _6530: TickerWord;

  public declare _OPEN_: TickerWord;

  public declare b1: PopSpikes;

  public declare blackOver: lib.flash.display.MovieClip;

  public declare cautionSign: lib.flash.display.MovieClip;

  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {
    this.addChild(this.blackOver);
  }
}
