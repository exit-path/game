import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";
import { Teleporter } from "./Teleporter";

export class Level103 extends Level {
  public declare g30: SwingingAxe;

  public declare g60: SwingingAxe;

  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

  public declare tb1: Teleporter;

  public declare tb2: Teleporter;

  public declare tc1: Teleporter;

  public declare tc2: Teleporter;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
