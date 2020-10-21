import lib from "swf-lib";
import { Level } from "./Level";
import { PopSpikes } from "./PopSpikes";

export class Level7 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare p1: PopSpikes;

  public declare p10: PopSpikes;

  public declare p11: PopSpikes;

  public declare p12: PopSpikes;

  public declare p13: PopSpikes;

  public declare p14: PopSpikes;

  public declare p15: PopSpikes;

  public declare p16: PopSpikes;

  public declare p2: PopSpikes;

  public declare p3: PopSpikes;

  public declare p4: PopSpikes;

  public declare p5: PopSpikes;

  public declare p6: PopSpikes;

  public declare p7: PopSpikes;

  public declare p8: PopSpikes;

  public declare p9: PopSpikes;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
