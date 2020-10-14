import lib from "swf-lib";
import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";
import { PopSpikes } from "./PopSpikes";

export class Level4 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare f1: SwingingAxe;

  public declare p10: PopSpikes;

  public declare p12: PopSpikes;

  public declare p14: PopSpikes;

  public declare p16: PopSpikes;

  public declare p18: PopSpikes;

  public declare p20: PopSpikes;

  public declare p6: PopSpikes;

  public declare p8: PopSpikes;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
