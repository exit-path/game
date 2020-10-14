import lib from "swf-lib";
import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";
import { Teleporter } from "./Teleporter";

export class Level8 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare g60: SwingingAxe;

  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

  public declare tb1: Teleporter;

  public declare tb2: Teleporter;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
