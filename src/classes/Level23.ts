import lib from "swf-lib";
import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";
import { Teleporter } from "./Teleporter";

export class Level23 extends Level {
  public declare a20: SwingingAxe;

  public declare a40: SwingingAxe;

  public declare a50: SwingingAxe;

  public declare a60: SwingingAxe;

  public declare cautionSign: lib.flash.display.MovieClip;

  public declare tc1: Teleporter;

  public declare tc2: Teleporter;

  public constructor() {
    super();
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
