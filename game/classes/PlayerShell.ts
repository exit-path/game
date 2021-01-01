import lib from "swf-lib";
import { Player } from "./Player";
import { StopWatch } from "./john/StopWatch";
import { YouArrow } from "./YouArrow";
import { Math2 } from "./john/Math2";

export class PlayerShell extends lib.flash.display.MovieClip {
  public declare checkPoints: any[];

  public declare colour: number;

  public declare colour2: number;

  public declare completedLevel: boolean;

  public declare curCheck: number;

  public declare fr: number;

  public declare handType: number;

  public declare headType: number;

  public declare host: boolean;

  public declare hostTime: number;

  public declare id: number;

  public declare isMain: boolean;

  public declare isPlayer: boolean;

  public declare kudos: number;

  public declare kudosToGive: number;

  public declare level: number;

  public declare matches: number;

  public declare oldX: number;

  public declare oldY: number;

  public declare ping: number;

  public declare placing: number;

  private declare player: Player;

  public declare tCounter: number;

  public declare tCounterGoal: number;

  public declare time: number;

  public declare timer: StopWatch;

  public declare toX: number;

  public declare toY: number;

  public declare userName: string;

  public declare wins: number;

  public declare xp: number;

  public declare xPos: number;

  public declare xScale: number;

  public declare xV: number;

  public declare youArrow: YouArrow;

  public declare yPos: number;

  public declare yV: number;

  public xpRound: number = 0;
  public kudoReceived: number = 0;

  public constructor() {
    super();
    this.completedLevel = false;
    this.isMain = true;
    this.level = 15;
    this.oldX = 0;
    this.placing = -1;
    this.hostTime = 0;
    this.wins = 295;
    this.oldY = 0;
    this.id = 0;
    this.kudos = 10;
    this.yPos = 250;
    this.host = false;
    this.isPlayer = false;
    this.curCheck = 0;
    this.xScale = 1;
    this.matches = 1254;
    this.xPos = 250;
    this.toX = 0;
    this.toY = 0;
    this.headType = 3;
    this.tCounterGoal = 0;
    this.handType = 3;
    this.colour = 16777215;
    this.time = 0;
    this.xV = 0;
    this.colour2 = 16777215;
    this.tCounter = 0;
    this.kudosToGive = 0;
    this.fr = 1;
    this.userName = "bob";
    this.xp = 1500;
    this.yV = 0;
    this.ping = Math2.random(400);
    this.timer = new StopWatch();
  }

  public init(): any {}
}
