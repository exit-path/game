import lib from "swf-lib";

export class Logger {
  public declare curLog: any[];

  public declare isAtCheckpoint: boolean;

  public declare logs: any[];

  public declare maxLogLength: number;

  public declare maxLogs: number;

  public declare playHead: number;

  public constructor() {
    this.isAtCheckpoint = false;
    this.maxLogLength = 1000;
    this.maxLogs = 1;
    this.playHead = 0;
    this.logs = new Array<any>();
  }

  public newLog(): any {
    if (this.logs.length > this.maxLogs) {
      this.logs.splice(0, 1);
    }
    var newLog: any[] = new Array<any>();
    this.logs.push(newLog);
    this.curLog = this.logs[this.logs.length - 1];
  }

  public ping(mov: lib.flash.display.MovieClip): any {
    if (this.curLog.length < this.maxLogLength) {
      this.curLog.push(
        new Array<any>(
          mov.x,
          mov.y,
          mov.currentFrame,
          mov["body"].currentFrame,
          mov.scaleX,
          this.isAtCheckpoint
        )
      );
      this.playHead = this.curLog.length - 1;
    }
  }

  public setFromLog(mov: lib.flash.display.MovieClip): any {
    mov.x = this.curLog[this.playHead][0];
    mov.y = this.curLog[this.playHead][1];
    mov.gotoAndPlay(this.curLog[this.playHead][2]);
    mov.body.gotoAndPlay(this.curLog[this.playHead][3]);
    mov.scaleX = this.curLog[this.playHead][4];
  }
}
