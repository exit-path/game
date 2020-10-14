import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";
import { Teleporter } from "./Teleporter";

export class Level112 extends Level {
  public declare a50: SwingingAxe;

  public declare tc1: Teleporter;

  public declare tc2: Teleporter;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
