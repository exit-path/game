import lib from "swf-lib";
import { LevelFlags } from "../../shared/level";
import { Level } from "./Level";

export class Level16 extends Level {
  public declare cautionSign: lib.flash.display.MovieClip;

  public declare lightOn: lib.flash.display.MovieClip;

  public declare triggeredLight: boolean;

  public constructor() {
    super();
    this.triggeredLight = false;
    this.flags = LevelFlags.FlowDisabled;
  }

  public uniqueLevelInit(): any {
    this.addChild(this.lightOn);
  }

  public uniqueLevelPing(): any {
    if (!this.triggeredLight) {
      if (this.player.x > 970) {
        this.triggeredLight = true;
        this.lightOn.play();
        this.parent["startLab"]();
      }
    }
  }
}
