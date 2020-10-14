import { Level } from "./Level";
import { PopSpikes } from "./PopSpikes";

export class Level101 extends Level {
  public declare p1: PopSpikes;

  public declare p2: PopSpikes;

  public declare p20: PopSpikes;

  public declare p3: PopSpikes;

  public declare p4: PopSpikes;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
