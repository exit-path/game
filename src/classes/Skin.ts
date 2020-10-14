import lib from "swf-lib";
import { Player } from "./Player";
import { YouArrow } from "./YouArrow";
import { Key } from "./john/Key";
import { Anim } from "./john/Anim";

export class Skin extends lib.flash.display.MovieClip {
  public declare checkPoints: any[];

  public declare colour: number;

  public declare colour2: number;

  public declare completedLevel: boolean;

  public declare curCheck: number;

  public declare handType: number;

  public declare headType: number;

  public declare id: number;

  public declare isMain: boolean;

  public declare kudos: number;

  public declare level: number;

  public declare matches: number;

  public declare oldX: number;

  public declare oldY: number;

  public declare placing: number;

  private declare player: Player;

  public declare tCounter: number;

  public declare time: number;

  public declare toX: number;

  public declare toY: number;

  public declare userName: string;

  public declare wins: number;

  public declare xp: number;

  public declare xV: number;

  public declare youArrow: YouArrow;

  public declare yV: number;

  public constructor() {
    super();
    this.isMain = true;
    this.level = 15;
    this.oldX = 0;
    this.placing = 0;
    this.wins = 295;
    this.oldY = 0;
    this.id = 0;
    this.kudos = 10;
    this.curCheck = 0;
    this.matches = 1254;
    this.headType = 3;
    this.toX = 0;
    this.toY = 0;
    this.handType = 12;
    this.colour = 16777215;
    this.time = 45;
    this.xV = 0;
    this.colour2 = 16777215;
    this.tCounter = 0;
    this.userName = "bob";
    this.xp = 1500;
    this.completedLevel = false;
    this.yV = 0;
  }

  public addCheckPoint(checkID: number): any {
    this.checkPoints[checkID].addFlag(this, this.colour, this.colour2);
  }

  public duck(): any {
    this.gotoAndStop(4);
  }

  public fuel(): any {
    this.setColours();
  }

  public handleSkin(): any {
    if (this.player.hitHalf) {
      this.duck();
    } else if (!this.player.jumpLevel) {
      this.gotoAndStop(3);
    } else if (Key.isDown(Key.LEFT)) {
      if (Key.isDown(Key.DOWN)) {
        this.duck();
      } else if (this.player.burningFlow) {
        this.gotoAndStop(5);
      } else {
        this.gotoAndStop(2);
      }
      this.scaleX = -1;
    } else if (Key.isDown(Key.RIGHT)) {
      if (Key.isDown(Key.DOWN)) {
        this.duck();
      } else if (this.player.burningFlow) {
        this.gotoAndStop(5);
      } else {
        this.gotoAndStop(2);
      }
      this.scaleX = 1;
    } else if (Key.isDown(Key.DOWN)) {
      this.duck();
    } else {
      this.gotoAndStop(1);
    }
    this.x = this.player.x;
    this.y = this.player.y;
  }

  public init(plyr: Player, checks: any[]): any {
    this.player = plyr;
    this.colour = this.player.colour;
    this.colour2 = this.player.colour2;
    this.checkPoints = checks;
  }

  public ping(): any {
    this.handleSkin();
    this.setColours();
  }

  public setChecks(checks: any[]): any {
    this.checkPoints = checks;
  }

  public setColours(): any {
    var mov: any = null;
    this["body"].head.gotoAndStop(this.headType);
    this["body"].handGear.handGear.gotoAndStop(this.handType);
    var part1: any[] = new Array<any>(
      this["body"].cb.i,
      this["body"].db.i,
      this["body"].head.hat,
      this["body"].handGear.handGear
    );
    for (var i: any = 0; i < part1.length; i++) {
      mov = part1[i];
      Anim.colourMe(mov, this.colour2);
    }
    var part2: any[] = new Array<any>(
      this["body"].aa.o,
      this["body"].aa.i,
      this["body"].ba.o,
      this["body"].ba.i,
      this["body"].ab.o,
      this["body"].ab.i,
      this["body"].cb.o,
      this["body"].db.o,
      this["body"].head.o,
      this["body"].body.o,
      this["body"].bb.o,
      this["body"].bb.i,
      this["body"].ca.o,
      this["body"].ca.i,
      this["body"].da.o,
      this["body"].da.i
    );
    for (i = 0; i < part2.length; i++) {
      mov = part2[i];
      Anim.colourMe(mov, this.colour);
    }
    if (this.youArrow) {
      Anim.colourMe(this.youArrow.lilArrow, this.colour);
    }
  }
}
