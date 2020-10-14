import lib from "swf-lib";
import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";

export class Level18 extends Level {
  public declare a10: SwingingAxe;

  public declare a13: SwingingAxe;

  public declare a16: SwingingAxe;

  public declare a19: SwingingAxe;

  public declare a22: SwingingAxe;

  public declare a25: SwingingAxe;

  public declare a4: SwingingAxe;

  public declare a7: SwingingAxe;

  public declare cautionSign: lib.flash.display.MovieClip;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
