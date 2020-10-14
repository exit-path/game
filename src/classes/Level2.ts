import lib from "swf-lib";
import { Level } from "./Level";

export class Level2 extends Level {
  public declare blackOver: lib.flash.display.MovieClip;

  public declare cautionSign: lib.flash.display.MovieClip;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {
    this.addChild(this.blackOver);
  }

  public uniqueLevelPing(): any {}
}
