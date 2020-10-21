import { Level } from "./Level";
import { Teleporter } from "./Teleporter";

export class Level100 extends Level {
  public declare tc1: Teleporter;

  public declare tc2: Teleporter;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
