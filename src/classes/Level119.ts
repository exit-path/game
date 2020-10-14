import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";

export class Level119 extends Level {
  public declare w60: SwingingAxe;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
