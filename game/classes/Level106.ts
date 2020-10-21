import { Level } from "./Level";
import { Teleporter } from "./Teleporter";

export class Level106 extends Level {
  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
