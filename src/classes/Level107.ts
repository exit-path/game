import { Level } from "./Level";
import { PopSpikes } from "./PopSpikes";
import { Teleporter } from "./Teleporter";

export class Level107 extends Level {
  public declare p19: PopSpikes;

  public declare p21: PopSpikes;

  public declare p23: PopSpikes;

  public declare p25: PopSpikes;

  public declare p27: PopSpikes;

  public declare p29: PopSpikes;

  public declare p31: PopSpikes;

  public declare p33: PopSpikes;

  public declare p35: PopSpikes;

  public declare p37: PopSpikes;

  public declare p39: PopSpikes;

  public declare p41: PopSpikes;

  public declare ta1: Teleporter;

  public declare ta2: Teleporter;

  public declare tb1: Teleporter;

  public declare tb2: Teleporter;

  public declare tc1: Teleporter;

  public declare tc2: Teleporter;

  public declare td1: Teleporter;

  public declare td2: Teleporter;

  public constructor() {
    super();
    this.levelType = "MP";
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
