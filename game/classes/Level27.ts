import lib from "swf-lib";
import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";

export class Level27 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare w1: SwingingAxe;

  public declare w10: SwingingAxe;

  public declare w15: SwingingAxe;

  public declare w20: SwingingAxe;

  public declare w25: SwingingAxe;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
