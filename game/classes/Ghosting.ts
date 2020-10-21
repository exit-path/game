import lib from "swf-lib";
import { Runner } from "./Runner";

export class Ghosting extends lib.flash.display.MovieClip {
  public declare ghosts: any[];

  public declare logs: any[];

  public constructor() {
    super();
    this.ghosts = new Array<any>();
  }

  public addGhosts(): any {
    var totalGhostLogs: number = NaN;
    var ghost: any = null;
    for (var i: any = 0; i < this.logs.length; i++) {
      if (i != this.logs.length - 1) {
        totalGhostLogs = ((this.logs.length - 1) * 0.8) / i;
        ghost = new Runner();
        this.addChild(ghost);
        this.ghosts.push(ghost);
        ghost.alpha = 0.2;
      }
    }
  }

  public handleGhosts(frameNum: number): any {
    var curGhost: any = null;
    var curLogPos: any = null;
    for (var i: any = 0; i < this.ghosts.length; i++) {
      curGhost = this.ghosts[i];
      if (frameNum < this.logs[i].length) {
        curLogPos = this.logs[i][frameNum];
        curGhost.x = curLogPos[0];
        curGhost.y = curLogPos[1];
        curGhost.gotoAndStop(curLogPos[2]);
        curGhost.scaleX = curLogPos[3];
      }
    }
  }

  public init(logFile: any[]): any {
    this.logs = logFile;
  }

  public killGhosts(): any {
    for (var i: any = 0; i < this.ghosts.length; i++) {
      this.removeChild(this.ghosts[i]);
      this.ghosts[i] = null;
    }
    this.ghosts.splice(0, this.ghosts.length);
  }

  public ping(frameCount: number): any {
    this.handleGhosts(frameCount);
  }

  public reset(): any {
    this.killGhosts();
    this.addGhosts();
  }
}
