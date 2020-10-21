import { Level } from "./Level";
import { Teleporter } from "./Teleporter";
import { SwingingAxe } from "./SwingingAxe";

export class Level113 extends Level {
  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

  public declare tb1: Teleporter;

  public declare tb2: Teleporter;

  public declare w60: SwingingAxe;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
