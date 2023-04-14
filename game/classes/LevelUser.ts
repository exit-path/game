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
import { TextPanel } from "./TextPanel";
import { TriggerBlock } from "./TriggerBlock";

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
    this.flags = userLevel.flags;
    for (const object of userLevel.objects) {
      const obj = lib.flash.display.DisplayObject.__initChar(
        () => this.makeObject(object.type),
        (obj) => {
          this.addChild(obj);
          obj.name = object.name;
          if (obj.name !== "") {
            this[obj.name] = obj;
          }
          const m = new lib.flash.geom.Matrix();
          m.a = object.matrix[0];
          m.b = object.matrix[1];
          m.c = object.matrix[2];
          m.d = object.matrix[3];
          m.tx = object.matrix[4];
          m.ty = object.matrix[5];
          obj.transform.matrix = m;
        }
      );
      if (obj instanceof TextPanel) {
        obj.txt.text = object.text ?? "";
      }
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
        return new TextPanel();
      case "trigger":
        return new TriggerBlock();
    }
  }
}
