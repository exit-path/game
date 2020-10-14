import lib from "swf-lib";
import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";

export class Level12 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare x1: SwingingAxe;

  public declare x3: SwingingAxe;

  public declare x5: SwingingAxe;

  public declare x7: SwingingAxe;

  public constructor() {
    super();
  }

  public preInitCheck(): any {
    this.levelColour = 0;
    this.obstacleColour = 0;
    this.repaint();
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
