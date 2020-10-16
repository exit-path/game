import lib from "swf-lib";
import { Level } from "./Level";
import { TickerWord } from "./TickerWord";
import { Turnstile } from "./Turnstile";

export class Level1 extends Level {
  public declare blackOver: lib.flash.display.MovieClip;

  public declare cautionSign: lib.flash.display.MovieClip;

  public declare sign: lib.flash.display.MovieClipT<{
    TICKERAB: TickerWord;
  }>;

  public declare touching: boolean;

  public declare turnstile: Turnstile;

  public constructor() {
    super();
    this.touching = false;
    this.turnstile = new Turnstile();
  }

  public uniqueLevelInit(): any {
    this.sign.TICKERAB.changeString("        ");
    this.addChild(this.turnstile);
    this.turnstile.x = 1217.15;
    this.turnstile.y = 429.25;
    this.addChild(this.blackOver);
  }

  public uniqueLevelPing(): any {
    if (!this.touching) {
      if (this.player.hitTestObject(this.turnstile)) {
        this.touching = true;
        this.turnstile.play();
        this.sign.TICKERAB.changeString("^^^^^^^^");
        this.player.parent["setPlayerName"](this.sign.TICKERAB.word);
      }
    } else if (!this.player.hitTestObject(this.turnstile)) {
      this.touching = false;
    }
  }
}
