import lib from "swf-lib";
import { Level } from "./Level";
import { TickerWord } from "./TickerWord";
import { PopSpikes } from "./PopSpikes";
import { Teleporter } from "./Teleporter";
import { LevelFlags } from "../../shared/level";

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
    this.flags = LevelFlags.FlowDisabled;
  }

  public uniqueLevelInit(): any {
    this.addChild(this.blackOver);
  }

  uniqueLevelPing() {
    this.__1532.ping();
    this._6530.ping();
    this._OPEN_.ping();
  }
}
