import lib from "swf-lib";
import { Level } from "./Level";
import { Teleporter } from "./Teleporter";

export class Level13 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

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
