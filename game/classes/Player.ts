import lib from "swf-lib";
import { TileObject } from "./john/TileObject";
import { Logger } from "./john/Logger";
import { Math2 } from "./john/Math2";
import { SoundBox } from "./john/SoundBox";
import { AchEvent } from "./AchEvent";
import { Key } from "./john/Key";
import { Relay } from "./john/Relay";
import { Anim } from "./john/Anim";
import { Tile } from "./Tile";
import { main } from "./global";
import { LevelFlags } from "../../shared/level";
import { Game } from "./Game";

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

  public triggerInteraction(): any {
    for (var i: any = 0; i < this.curLevel.triggers.length; i++) {
      var trigger = this.curLevel.triggers[i];
      /* check all pop triggers for pop on/off */
      if (trigger.typeTrigger.includes("POP")) {
        trigger.popCheck(this.curLevel);
      }
      if (this.hitTestObject(trigger)) {
        /* Change flow mode flow mode */
        if (trigger.typeTrigger.includes("INF") && trigger.effectOn) {
          main().multiplayer.game.level.flags =
            (main().multiplayer.game.level.flags & ~LevelFlags.FlowModeMask) |
            LevelFlags.FlowAlways;
          // unable to use it again
          if (trigger.typeTrigger.includes("SNG")) {
            trigger.effectOn = false;
            this.curLevel.applyObstacleColour(trigger, 0xff660000);
          }
        } else if (trigger.typeTrigger.includes("NRM") && trigger.effectOn) {
          main().multiplayer.game.level.flags =
            (main().multiplayer.game.level.flags & ~LevelFlags.FlowModeMask) |
            LevelFlags.FlowNormal;
          if (trigger.typeTrigger.includes("SNG")) {
            trigger.effectOn = false;
            this.curLevel.applyObstacleColour(trigger, 0xff660000);
          }
        } else if (trigger.typeTrigger.includes("NOF") && trigger.effectOn) {
          main().multiplayer.game.level.flags =
            (main().multiplayer.game.level.flags & ~LevelFlags.FlowModeMask) |
            LevelFlags.FlowDisabled;
          if (this.burningFlow) this.parent["stopBurningFlowMusic"]();
          this.burningFlow = false;
          if (trigger.typeTrigger.includes("SNG")) {
            trigger.effectOn = false;
            this.curLevel.applyObstacleColour(trigger, 0xff660000);
          }
        } else if (trigger.typeTrigger.includes("STF")) {
          /* set the value of flow points */
          var flowVal = +trigger.typeTrigger.slice(3);
          this.flowPoints = flowVal;
        } else if (trigger.typeTrigger.includes("JMP")) {
          /* trigger that resets jump on collision */
          this.jumpLevel = true;
          this.yLove = 0;
          /* Not fully working, keep for later
      } else if (trigger.typeTrigger.includes("GRV")) {
          var newG = +trigger.typeTrigger.slice(3);
          if (newG * this.yGrav < 0) 
            (this.parent as Game).skin.rotation = ((this.parent as Game).skin.rotation + 180)%360;
          (this.parent as Game).player. += 150;
          this.yGrav = newG;
      */
        } else if (trigger.typeTrigger.includes("SKN")) {
          /* trigger that sets a random skin */
          const game = this.parent as Game;
          this.headType = Math.floor(Math.random() * 24);
          this.handType = Math.floor(Math.random() * 24);
          this.colour = Math.floor(Math.random() * 0xffffff);
          this.colour2 = Math.floor(Math.random() * 0xffffff);
          game.addSkin();
        } else if (trigger.typeTrigger.includes("BEM")) {
          /* trigger to emit beams */
          (this.parent as Game).emitBeam(this.x, this.y, this.width);
        } else if (trigger.typeTrigger.includes("COL")) {
          this.curLevel.colorBG =
            trigger.typeTrigger.slice(3) == "RND"
              ? Math.random() * 0xffffffff
              : parseInt(trigger.typeTrigger.slice(3), 16) || 0;
        } else {
          if (this.curLevel.triggers[i].dst.length != 0) {
            this.curLevel.triggers[i].triggered = true;
            this.curLevel.applyObstacleColour(
              this.curLevel.triggers[i],
              0xff00ff00
            );
            for (var tr of this.curLevel.triggers[i].dst) {
              tr.triggerDEL(this.curLevel);
            }
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
      this.yVel = this.yGrav < 0 ? -this.hops : this.hops;
      this.yLove = 1;
      this.parent["playerObject"].jumps++;
      if (this.parent["playerObject"].jumps >= 1000) {
        this.dispatchEvent(new AchEvent(AchEvent.SEND, 6));
      }
    }
  }

  public handleFlow(): any {
    const level = main().multiplayer.game.level;
    const flowMode = level.flags & LevelFlags.FlowModeMask;
    if (flowMode === LevelFlags.FlowDisabled) {
      return;
    }

    if (this.burningFlow) {
      if (flowMode !== LevelFlags.FlowAlways) {
        this.flowPoints = this.flowPoints - 5;
      }
      if (!Key.isDown(Key.FLOW)) {
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
      if (flowMode === LevelFlags.FlowAlways) {
        this.flowPoints = 400;
        this.fullFlow = true;
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
      }
      if (Key.isDown(Key.FLOW) && this.flowPoints >= 100) {
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

    const level = main().multiplayer.game.level;
    const flowMode = level.flags & LevelFlags.FlowModeMask;
    if (flowMode === LevelFlags.FlowAlways) {
      this.flowPoints = 400;
      this.fullFlow = true;
    }
  }

  public kill(): any {
    this.dispatchEvent(new Relay(Relay.SEND, "KILL"));
  }

  public levelInteraction(): any {
    const height = this.curLevel.maxHeight;
    if (
      (height <= 550 && this.y > 550) ||
      (height > 550 && this.y > height + 50)
    ) {
      this.kill();
    }
    if (this.yGrav < 0 && this.y < this.curLevel.minHeight - 50) {
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
      /* if(this.yGrav >= 0) {*/
      if (!this.holdDown) {
        if (this.xVel > 0 - this.playerXMax) {
          this.xVel = this.xVel - this.xAcc;
        }
      }
      /*} else {
        if (!this.holdDown) {
          if (this.xVel < this.playerXMax) {
            this.xVel = this.xVel + this.xAcc;
          }
        }
      }*/
    } else if (Key.isDown(Key.RIGHT)) {
      /*if(this.yGrav >= 0) {*/
      if (!this.holdDown) {
        if (this.xVel < this.playerXMax) {
          this.xVel = this.xVel + this.xAcc;
        }
      }
      /*} else {
        if (!this.holdDown) {
          if (this.xVel > 0 - this.playerXMax) {
            this.xVel = this.xVel - this.xAcc;
          }
        }
      }*/
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

    const game = this.parent as Game;
    if (!game.isPaused) {
      this.movePlayer();
    }
    if (!game.isPaused || game.level.flags & LevelFlags.PauseUnaffectPlayer) {
      this.handleHalfTiles();
      this.updateTileInteraction();
    }
    this.spikeInteraction();
    this.levelInteraction();
    this.teleporterInteraction();
    this.checkPointInteraction();
    this.triggerInteraction();
  }

  public spikeInteraction(): any {
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
    for (const bouncer of this.curLevel.bouncers) {
      if (this.hitTestObject(bouncer) && bouncer.currentFrame == 1) {
        var angle = bouncer.rotation * (Math.PI / 180);
        var newX = angle == 0 ? 0 : Math.round(20 * Math.sin(angle));
        var newY = Math.round(-20 * Math.cos(angle));
        if (newX != 0) {
          this.xVel = newX;
        }
        this.yVel = newY /** bouncer.bouncyness*/;
        this.yLove = this.yVel > 0 ? -1 : 1;

        bouncer.bounces++;
        if (bouncer.bounces == 10) {
          this.dispatchEvent(new AchEvent(AchEvent.SEND, 10));
        }
        this.playerJump = true;
        this.jumpLevel = false;
        bouncer.gotoAndPlay(2);
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
    for (const fs of this.curLevel.fallingSpikes) {
      const angle = Math.round(fs.rotation);
      let isVertical: boolean;
      switch (angle) {
        case 0:
        case 180:
        case -180:
          isVertical = true;
          break;
        case 90:
        case -90:
          isVertical = false;
          break;
        default:
          continue;
      }

      if (fs.smashState == 0) {
        let hit = false;
        if (isVertical) {
          hit = Math.abs(this.x - fs.x) < 10;
        } else {
          hit = Math.abs(this.y - fs.y) < 10;
        }
        if (hit) {
          fs.smashState = 1;
          SoundBox.playSound("SpikeDrop");
        }
      } else if (fs.smashState == 1) {
        fs.spikeIn.y -= 20;
        for (const tile of this.curLevel.tiles) {
          if (tile.hitTestObject(fs.spikeIn.hitA)) {
            fs.smashState = 2;
            SoundBox.playSound("Thud");
            break;
          }
        }
      } else if (fs.smashState == 2) {
        fs.spikeIn.y += 10;
        if (fs.spikeIn.y > 0) {
          fs.smashState = 0;
          fs.spikeIn.y = 0;
        }
      }

      if (this.hitTestObject(fs.spikeIn.hitA)) {
        this.kill();
        return;
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
          if (this.curLevel.teleporters[i].partner) {
            this.x = this.curLevel.teleporters[i].partner.x;
            this.y = this.curLevel.teleporters[i].partner.y;
            this.parent["emitBeam"](
              this.curLevel.teleporters[i].x - 17,
              this.curLevel.teleporters[i].y,
              25
            );
            this.parent["emitBeam"](this.x - 17, this.y, 25);
            SoundBox.playSound("WhooshSound");
          }
          return;
        }
      }
    }
  }

  public touchBlock(mov: Tile) {
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
