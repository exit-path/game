import { Level } from "./Level";
import { Teleporter } from "./Teleporter";

export class Level116 extends Level {
  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

  public declare tb1: Teleporter;

  public declare tb2: Teleporter;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
