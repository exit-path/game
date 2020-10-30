import lib from "swf-lib";
import { Level } from "./Level";
import { FreedomSequence } from "./FreedomSequence";
import { Turnstile } from "./Turnstile";
import { TickerWord } from "./TickerWord";

export class Level30 extends Level {
  public declare ending: FreedomSequence;

  public declare hasTouched: boolean;

  public declare sign: lib.flash.display.MovieClipT<{
    TICKERA: TickerWord;
    TICKERB: TickerWord;
  }>;

  public declare touching: boolean;

  public declare turnstile: Turnstile;

  public constructor() {
    super();
    this.touching = false;
    this.hasTouched = false;
  }

  public endEnding(): any {
    this.ending.visible = false;
    this.ending.stop();
    this.removeChild(this.ending);
  }

  public uniqueLevelInit(): any {
    this.sign.TICKERA.changeString("        ", true);
    this.sign.TICKERB.changeString("                 ", true);
    this.addChild(this.turnstile);
    this.addChild(this.ending);
    this.parent["bg"].visible = false;
  }

  public uniqueLevelPing(): any {
    this.sign.TICKERA.ping();
    this.sign.TICKERB.ping();
    if (!this.touching) {
      if (!this.hasTouched && this.player.hitTestObject(this.turnstile)) {
        this.touching = true;
        this.hasTouched = true;
        this.turnstile.play();
        this.sign.TICKERA.changeString(this.timeString, false);
        this.sign.TICKERB.changeString(this.timeRank, false);
      }
    } else if (!this.player.hitTestObject(this.turnstile)) {
      this.touching = false;
    }
  }
}
