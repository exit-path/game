import lib from "swf-lib";
import { TileObject } from "./john/TileObject";
import { Logger } from "./john/Logger";
import { Math2 } from "./john/Math2";
import { SoundBox } from "./john/SoundBox";
import { AchEvent } from "./AchEvent";
import { Key } from "./john/Key";
import { Relay } from "./john/Relay";
import { Anim } from "./john/Anim";

export class Player extends TileObject {
  public declare beltSpeed: number;

  public declare burningFlow: boolean;

  public declare burningXAcc: number;

  public declare colour: number;

  public declare colour2: number;

  public declare completedLevel: boolean;

  public declare flowPoints: number;

  public declare fullFlow: boolean;

  public declare gameMode: number;

  public declare gameName: string;

  public declare handType: number;

  public declare headType: number;

  public declare hitHalf: boolean;

  private declare holdDownX: number;

  public declare isMain: boolean;

  public declare kudos: number;

  public declare kudosToGive: number;

  public declare level: number;

  public declare levelNum: number;

  public declare matches: number;

  public declare mySprite: lib.flash.display.MovieClip;

  public declare normalXAcc: number;

  public declare placing: number;

  public declare playerLog: Logger;

  public declare playerXBurningMax: number;

  public declare playerXMax: number;

  public declare playerXNormalMax: number;

  public declare playerYMax: number;

  public declare restartPoint: lib.flash.display.MovieClip;

  public declare rewinding: boolean;

  public declare teleporting: boolean;

  public declare time: number;

  public declare userName: string;

  public declare wins: number;

  public declare xp: number;

  public constructor() {
    super();
    this.burningFlow = false;
    this.isMain = true;
    this.placing = 0;
    this.level = 15;
    this.wins = 295;
    this.gameName = "01234567";
    this.kudos = 10;
    this.playerXNormalMax = 8;
    this.playerXBurningMax = 50;
    this.playerYMax = 15;
    this.flowPoints = 0;
    this.matches = 1254;
    this.gameMode = 0;
    this.burningXAcc = 3;
    this.rewinding = false;
    this.handType = 0;
    this.playerXMax = 8;
    this.headType = 0;
    this.time = 0;
    this.teleporting = false;
    this.fullFlow = false;
    this.levelNum = 0;
    this.normalXAcc = 0.8;
    this.kudosToGive = 2;
    this.hitHalf = false;
    this.xp = 1500;
    this.completedLevel = false;
    this.beltSpeed = 2;
    this.colour = Math2.randomColour();
    this.colour2 = Math2.randomColour();
    this.userName = "Naruto" + Math2.random(1000);
  }

  public checkPointInteraction(): any {
    for (var i: any = 0; i < this.curLevel.checkPoints.length; i++) {
      if (this.hitTestObject(this.curLevel.checkPoints[i])) {
        if (this.curLevel.startPoint != this.curLevel.checkPoints[i]) {
          if (this.curLevel.checkPoints[i].isNew(this)) {
            SoundBox.playSound("CheckpointSound");
            this.curLevel.startPoint = this.curLevel.checkPoints[i];
            this.curLevel.checkPoints[i].addFlag(
              this,
              this.colour,
              this.colour2
            );
          }
        }
      }
    }
  }

  public doTheJump(): any {
    this.jumpCounter++;
    this.holdUp = true;
    if (this.yLove == 0 && this.jumpLevel && !this.hitHalf) {
      SoundBox.playSound("JumpSound");
      this.playerJump = true;
      this.jumpLevel = false;
      this.yVel = this.hops;
      this.yLove = 1;
      this.parent["playerObject"].jumps++;
      if (this.parent["playerObject"].jumps >= 1000) {
        this.dispatchEvent(new AchEvent(AchEvent.SEND, 6));
      }
    }
  }

  public handleFlow(): any {
    if (this.levelNum <= 1) {
      return;
    }
    if (this.levelNum == 16) {
      return;
    }
    if (this.burningFlow) {
      this.flowPoints = this.flowPoints - 5;
      if (
        !(
          Key.isDown(lib.flash.ui.Keyboard.SPACE) ||
          Key.isDown(lib.flash.ui.Keyboard.SHIFT)
        )
      ) {
        this.burningFlow = false;
        this.parent["stopBurningFlowMusic"]();
      } else if (this.flowPoints <= 0) {
        this.flowPoints = 0;
        this.burningFlow = false;
        this.parent["stopBurningFlowMusic"]();
        if (this.fullFlow) {
          this.dispatchEvent(new AchEvent(AchEvent.SEND, 8));
        }
      }
    } else {
      if (Math.abs(this.xVel) > 2) {
        this.flowPoints = this.flowPoints + 2;
      } else {
        this.flowPoints = this.flowPoints - 20;
      }
      if (this.flowPoints < 0) {
        this.flowPoints = 0;
      }
      if (this.flowPoints > 400) {
        this.flowPoints = 400;
        this.dispatchEvent(new AchEvent(AchEvent.SEND, 7));
        this.fullFlow = true;
      } else {
        this.fullFlow = false;
      }
      if (
        (Key.isDown(lib.flash.ui.Keyboard.SPACE) ||
          Key.isDown(lib.flash.ui.Keyboard.SHIFT)) &&
        this.flowPoints >= 100
      ) {
        this.burningFlow = true;
        this.parent["startBurningFlowMusic"]();
        SoundBox.playSound("Takeoff");
      }
    }
  }

  public handleHalfTiles(): any {
    var curTile: any = null;
    this.hitHalf = false;
    for (var i: any = 0; i < this.curLevel.halfTiles.length; i++) {
      curTile = this.curLevel.halfTiles[i];
      if (this.hitTestObject(curTile)) {
        this.hitHalf = true;
        if (this.jumpLevel == false) {
          this.xVel = 0;
        } else if (!this.holdDown) {
          this.xVel = this.xVel * 0.7;
        }
      }
    }
  }

  public hitBlock(mov: lib.flash.display.MovieClip): any {}

  public initPlayer(): any {
    this.xF = 1;
    this.dXVel = 5;
    this.xMax = 20;
    this.playerXMax = 8;
    this.playerYMax = 20;
    this.xAcc = 0.8;
    this.normalXAcc = 0.8;
    this.burningXAcc = 1.5;
  }

  public kill(): any {
    this.dispatchEvent(new Relay(Relay.SEND, "KILL"));
  }

  public levelInteraction(): any {
    if (this.y > 550) {
      this.kill();
    }
    if (this.hitTestObject(this.curLevel.endPoint)) {
      this.completedLevel = true;
      this.parent["finishLevel"]();
    }
  }

  public movePlayer(): any {
    if (Key.isDown(Key.UP)) {
      if (!this.holdUp) {
        this.doTheJump();
        this.holdUp = true;
      }
    } else {
      this.holdUp = false;
      this.jumpCounter = 0;
    }
    if (Key.isDown(Key.DOWN)) {
      if (!this.holdDown) {
        this.holdDownX = this.x;
      }
      this.holdDown = true;
      this.xF = 0.9;
      this.scaleY = 0.5;
    } else {
      if (this.holdDown) {
        if (Math.abs(this.holdDownX - this.x) > 200) {
          this.dispatchEvent(new AchEvent(AchEvent.SEND, 9));
        }
      }
      this.holdDown = false;
      this.xF = 0.7;
      this.scaleY = 1;
    }
    if (Key.isDown(Key.LEFT)) {
      if (!this.holdDown) {
        if (this.xVel > 0 - this.playerXMax) {
          this.xVel = this.xVel - this.xAcc;
        }
      }
    } else if (Key.isDown(Key.RIGHT)) {
      if (!this.holdDown) {
        if (this.xVel < this.playerXMax) {
          this.xVel = this.xVel + this.xAcc;
        }
      }
    }
    if (Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT)) {
      this.xF = 1;
      if (this.holdDown && !this.hitHalf) {
        this.xVel = this.xVel * 0.95;
      }
    } else {
      this.xF = 0.5;
    }
    if (this.burningFlow) {
      this.playerXMax = this.playerXBurningMax;
      this.xAcc = this.burningXAcc;
    } else {
      this.xAcc = this.normalXAcc;
      this.playerXMax = Anim.ease(this.playerXMax, this.playerXNormalMax, 0.3);
    }
    this.handleFlow();
  }

  public ping(): any {
    if (this.completedLevel) {
      return;
    }
    this.playerSize = 1;
    this.typeOf = "deadaphant";
    this.thudTresh = 10;
    this.movePlayer();
    this.handleHalfTiles();
    this.updateTileInteraction();
    this.spikeInteraction();
    this.levelInteraction();
    this.teleporterInteraction();
    this.checkPointInteraction();
  }

  public spikeInteraction(): any {
    var j: number = 0;
    for (var i: any = 0; i < this.curLevel.spikes.length; i++) {
      if (this.hitTestObject(this.curLevel.spikes[i].hitA)) {
        this.kill();
        return;
      }
    }
    for (i = 0; i < this.curLevel.swingingAxes.length; i++) {
      if (this.hitTestObject(this.curLevel.swingingAxes[i].axe)) {
        if (
          this.hitTestObject(this.curLevel.swingingAxes[i].axe.side0) ||
          this.hitTestObject(this.curLevel.swingingAxes[i].axe.side1)
        ) {
          this.kill();
          return;
        }
      }
    }
    for (i = 0; i < this.curLevel.popSpikes.length; i++) {
      if (this.hitTestObject(this.curLevel.popSpikes[i].inside.spikes.hitA)) {
        this.kill();
        return;
      }
    }
    for (i = 0; i < this.curLevel.grinders.length; i++) {
      if (
        Math2.dist(
          this.x,
          this.y,
          this.curLevel.grinders[i].x,
          this.curLevel.grinders[i].y
        ) < this.curLevel.grinders[i].dist
      ) {
        this.kill();
        return;
      }
    }
    for (i = 0; i < this.curLevel.bouncers.length; i++) {
      if (
        this.hitTestObject(this.curLevel.bouncers[i]) &&
        this.curLevel.bouncers[i].currentFrame == 1
      ) {
        this.yVel = -20;
        this.curLevel.bouncers[i].bounces++;
        if (this.curLevel.bouncers[i].bounces == 10) {
          this.dispatchEvent(new AchEvent(AchEvent.SEND, 10));
        }
        this.playerJump = true;
        this.jumpLevel = false;
        this.yLove = 1;
        this.curLevel.bouncers[i].gotoAndPlay(2);
        SoundBox.playSound("BouncerSound");
        return;
      }
    }
    for (i = 0; i < this.curLevel.plates.length; i++) {
      if (this.hitTestObject(this.curLevel.plates[i])) {
        this.curLevel.plates[i].gotoAndStop(2);
        this.curLevel[
          "lg" + this.curLevel.plates[i].name.substr(1, 1)
        ].gotoAndStop(2);
      } else {
        this.curLevel.plates[i].gotoAndStop(1);
        this.curLevel[
          "lg" + this.curLevel.plates[i].name.substr(1, 1)
        ].gotoAndStop(1);
      }
    }
    for (i = 0; i < this.curLevel.fallingSpikes.length; i++) {
      if (
        this.curLevel.fallingSpikes[i].rotation == 0 ||
        this.curLevel.fallingSpikes[i].rotation == 180
      ) {
        if (this.curLevel.fallingSpikes[i].smashState == 0) {
          if (Math.abs(this.x - this.curLevel.fallingSpikes[i].x) < 10) {
            this.curLevel.fallingSpikes[i].smashState = 1;
            SoundBox.playSound("SpikeDrop");
          }
        } else if (this.curLevel.fallingSpikes[i].smashState == 1) {
          this.curLevel.fallingSpikes[i].spikeIn.y =
            this.curLevel.fallingSpikes[i].spikeIn.y - 20;
          for (j = 0; j < this.curLevel.tiles.length; j++) {
            if (
              this.curLevel.tiles[j].hitTestObject(
                this.curLevel.fallingSpikes[i].spikeIn.hitA
              )
            ) {
              this.curLevel.fallingSpikes[i].smashState = 2;
              SoundBox.playSound("Thud");
              break;
            }
          }
        } else if (this.curLevel.fallingSpikes[i].smashState == 2) {
          this.curLevel.fallingSpikes[i].spikeIn.y =
            this.curLevel.fallingSpikes[i].spikeIn.y + 10;
          if (this.curLevel.fallingSpikes[i].spikeIn.y > 0) {
            this.curLevel.fallingSpikes[i].smashState = 0;
            this.curLevel.fallingSpikes[i].spikeIn.y = 0;
          }
        }
        if (this.hitTestObject(this.curLevel.fallingSpikes[i].spikeIn.hitA)) {
          this.kill();
          return;
        }
      }
    }
  }

  public teleporterInteraction(): any {
    var i: number = 0;
    if (this.teleporting) {
      for (i = 0; i < this.curLevel.teleporters.length; i++) {
        if (this.hitTestObject(this.curLevel.teleporters[i])) {
          return;
        }
      }
      this.teleporting = false;
    } else {
      for (i = 0; i < this.curLevel.teleporters.length; i++) {
        if (this.hitTestObject(this.curLevel.teleporters[i])) {
          this.teleporting = true;
          this.x = this.curLevel.teleporters[i].partner.x;
          this.y = this.curLevel.teleporters[i].partner.y;
          this.parent["emitBeam"](
            this.curLevel.teleporters[i].x - 17,
            this.curLevel.teleporters[i].y,
            25
          );
          this.parent["emitBeam"](this.x - 17, this.y, 25);
          SoundBox.playSound("WhooshSound");
          return;
        }
      }
    }
  }

  public touchBlock(mov: lib.flash.display.MovieClip): any {
    if (mov.typeOf == 5) {
      this.xVel = this.xVel + (0 - this.beltSpeed);
    } else if (mov.typeOf == 6) {
      this.xVel = this.xVel + this.beltSpeed;
    } else if (this.xVel > this.playerXMax) {
      this.xVel = this.playerXMax;
    } else if (this.xVel < 0 - this.playerXMax) {
      this.xVel = 0 - this.playerXMax;
    }
  }
}
