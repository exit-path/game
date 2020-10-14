import lib from "swf-lib";
import { Level } from "./Level";

export class Level11 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

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
