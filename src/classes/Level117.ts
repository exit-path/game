import { Level } from "./Level";
import { SwingingAxe } from "./SwingingAxe";

export class Level117 extends Level {
  public declare w1: SwingingAxe;

  public declare w15: SwingingAxe;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
