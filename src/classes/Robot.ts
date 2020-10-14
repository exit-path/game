import lib from "swf-lib";
import { TileObject } from "./john/TileObject";
import { Math2 } from "./john/Math2";

export class Robot extends TileObject {
  public declare beltSpeed: number;

  public declare colour: number;

  public declare colour2: number;

  public declare d: boolean;

  public declare gameMode: number;

  public declare hitHalf: boolean;

  public declare id: number;

  public declare isMain: boolean;

  public declare l: boolean;

  public declare levelNum: number;

  public declare mySprite: lib.flash.display.MovieClip;

  public declare playerXMax: number;

  public declare playerYMax: number;

  public declare r: boolean;

  public declare restartPoint: lib.flash.display.MovieClip;

  public declare teleporting: boolean;

  public declare time: number;

  public declare u: boolean;

  public declare userName: string;

  public constructor() {
    super();
    this.isMain = false;
    this.playerXMax = 8;
    this.l = false;
    this.time = 0;
    this.teleporting = false;
    this.id = 5;
    this.levelNum = 0;
    this.d = false;
    this.playerYMax = 15;
    this.hitHalf = false;
    this.r = false;
    this.gameMode = 0;
    this.u = false;
    this.beltSpeed = 2;
    this.userName = "hello";
    this.colour = Math2.randomColour();
    this.colour2 = Math2.randomColour();
  }

  public doTheJump(): any {
    this.jumpCounter++;
    this.holdUp = true;
    if (this.yLove == 0 && this.jumpLevel && !this.hitHalf) {
      this.playerJump = true;
      this.jumpLevel = false;
      this.yVel = this.hops;
      this.yLove = 1;
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
  }

  public levelInteraction(): any {
    for (var i: any = 0; i < this.curLevel.bouncers.length; i++) {
      if (
        this.hitTestObject(this.curLevel.bouncers[i]) &&
        this.curLevel.bouncers[i].currentFrame == 1
      ) {
        this.yVel = -20;
        this.playerJump = true;
        this.jumpLevel = false;
        this.yLove = 1;
        this.curLevel.bouncers[i].gotoAndPlay(2);
        return;
      }
    }
  }

  public movePlayer(): any {
    if (this.u) {
      if (!this.holdUp) {
        this.doTheJump();
        this.holdUp = true;
      }
    } else {
      this.holdUp = false;
      this.jumpCounter = 0;
    }
    if (this.d) {
      this.holdDown = true;
      this.xF = 0.9;
      this.scaleY = 0.5;
    } else {
      this.holdDown = false;
      this.xF = 0.7;
      this.scaleY = 1;
    }
    if (this.l) {
      if (!this.holdDown) {
        if (this.xVel > 0 - this.playerXMax) {
          this.xVel = this.xVel - this.xAcc;
        }
      }
    } else if (this.r) {
      if (!this.holdDown) {
        if (this.xVel < this.playerXMax) {
          this.xVel = this.xVel + this.xAcc;
        }
      }
    }
    if (this.l || this.r) {
      this.xF = 1;
      if (this.holdDown && !this.hitHalf) {
        this.xVel = this.xVel * 0.95;
      }
    } else {
      this.xF = 0.5;
    }
  }

  public ping(): any {
    this.playerSize = 1;
    this.typeOf = "deadaphant";
    this.thudTresh = 10;
    this.movePlayer();
    this.handleHalfTiles();
    this.updateTileInteraction();
    this.levelInteraction();
    this.teleporterInteraction();
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
