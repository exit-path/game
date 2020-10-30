import { Level } from "./Level";
import type { Level as UserLevel, LevelObjectType } from "../../shared/level";
import lib from "swf-lib";
import { StartPointHolder } from "./StartPointHolder";
import { EndPointHolder } from "./EndPointHolder";
import { TileHolder } from "./TileHolder";
import { HalfBlockHolder } from "./HalfBlockHolder";
import { InvisibleTileHolder } from "./InvisibleTileHolder";
import { Bouncer } from "./Bouncer";
import { SpikesHolder } from "./SpikesHolder";
import { PopSpikes } from "./PopSpikes";
import { SpikeFall } from "./SpikeFall";
import { LaserCannon } from "./LaserCannon";
import { SwingingAxe } from "./SwingingAxe";
import { Grinder } from "./Grinder";
import { CheckpointHolder } from "./CheckpointHolder";
import { Teleporter } from "./Teleporter";
import { TreadmillLeftHolder } from "./TreadmillLeftHolder";
import { TreadmillRightHolder } from "./TreadmillRightHolder";

export class LevelUser extends Level {
  public constructor(userLevel: UserLevel) {
    super();
    this.levelType = "MP";

    this.lockCamX = false;
    this.lockCamY = false;
    this.initUserLevel(userLevel);
  }

  private initUserLevel(userLevel: UserLevel) {
    this.name = userLevel.name;
    for (const object of userLevel.objects) {
      lib.flash.display.DisplayObject.__initChar(
        () => this.makeObject(object.type),
        (obj) => {
          this.addChild(obj);
          obj.name = object.name;
          obj.transform.matrix.__value[0] = object.matrix[0];
          obj.transform.matrix.__value[1] = object.matrix[1];
          obj.transform.matrix.__value[2] = object.matrix[2];
          obj.transform.matrix.__value[3] = object.matrix[3];
          obj.transform.matrix.__value[4] = object.matrix[4];
          obj.transform.matrix.__value[5] = object.matrix[5];
          obj.__node.markLayoutDirty();
          if (obj.name !== "") {
            this[obj.name] = obj;
          }
        }
      );
    }
  }

  private makeObject(type: LevelObjectType): lib.flash.display.DisplayObject {
    switch (type) {
      case "start-point":
        return new StartPointHolder();
      case "end-point":
        return new EndPointHolder();
      case "tile":
        return new TileHolder();
      case "half-tile":
        return new HalfBlockHolder();
      case "invisible-tile":
        return new InvisibleTileHolder();
      case "bouncer":
        return new Bouncer();
      case "spikes":
        return new SpikesHolder();
      case "pop-spikes":
        return new PopSpikes();
      case "fall-spikes":
        return new SpikeFall();
      case "laser-cannon":
        return new LaserCannon();
      case "swinging-axe":
        return new SwingingAxe();
      case "grinder":
        return new Grinder();
      case "checkpoint":
        return new CheckpointHolder();
      case "teleporter":
        return new Teleporter();
      case "left-treadmill":
        return new TreadmillLeftHolder();
      case "right-treadmill":
        return new TreadmillRightHolder();
      case "text":
        return new lib.flash.display.MovieClip();
    }
  }
}
