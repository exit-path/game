import lib from "swf-lib";
import { Level } from "./Level";

export class Level15 extends Level {
  public declare blackOver: lib.flash.display.MovieClip;

  public declare cautionSign: lib.flash.display.MovieClip;

  public declare sign: lib.flash.display.MovieClip;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {
    this.addChild(this.blackOver);
    this.addChild(this.sign);
  }

  public uniqueLevelPing(): any {}
}
