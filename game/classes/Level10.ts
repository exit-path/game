import lib from "swf-lib";
import { Level } from "./Level";
import { Turnstile } from "./Turnstile";
import { Math2 } from "./john/Math2";
import { TickerWord } from "./TickerWord";

export class Level10 extends Level {
  public declare b0: lib.flash.display.MovieClip;

  public declare b1: lib.flash.display.MovieClip;

  public declare b2: lib.flash.display.MovieClip;

  public declare b3: lib.flash.display.MovieClip;

  public declare b4: lib.flash.display.MovieClip;

  public declare b5: lib.flash.display.MovieClip;

  public declare b6: lib.flash.display.MovieClip;

  public declare blackOver: lib.flash.display.MovieClip;

  public declare cautionSign: lib.flash.display.MovieClip;

  public declare hasTouched: boolean;

  public declare redPing: lib.flash.display.MovieClip;

  public declare sign: lib.flash.display.MovieClipT<{
    TICKE: TickerWord;
  }>;

  public declare slidingDoor: lib.flash.display.MovieClip;

  public declare slidingDoor2: lib.flash.display.MovieClip;

  public declare touching: boolean;

  public declare turnstile: Turnstile;

  public constructor() {
    super();
    this.touching = false;
    this.hasTouched = false;
  }

  public uniqueLevelInit(): any {
    this.sign.TICKE.changeString("     ", true);
    this.addChild(this.turnstile);
    this.addChild(this.blackOver);
  }

  public uniqueLevelPing(): any {
    this.sign.TICKE.ping();
    var i: any = NaN;
    if (!this.touching) {
      if (!this.hasTouched && this.player.hitTestObject(this.turnstile)) {
        this.touching = true;
        this.hasTouched = true;
        this.turnstile.play();
        this.sign.TICKE.changeString("AUDIT", true);
        this.slidingDoor.play();
        this.parent["startLab"]();
        for (i = 0; i < 7; i++) {
          this["b" + i].gotoAndStop(2);
          this["b" + i].beacon.gotoAndPlay(
            Math2.random(this["b" + i].beacon.totalFrames - 1) + 1
          );
        }
        this.addChild(this.redPing);
        this.redPing.gotoAndStop(2);
      }
    } else if (!this.player.hitTestObject(this.turnstile)) {
      this.touching = false;
    }
  }
}
