import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";

export class Level109 extends Level {
  public declare g30: SwingingAxe;

  public declare g60: SwingingAxe;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
