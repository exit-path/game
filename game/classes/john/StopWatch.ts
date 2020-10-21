import lib from "swf-lib";

export class StopWatch {
  public declare completeString: string;

  public static fr: number = 30;

  public declare frameBased: boolean;

  public declare timer: lib.flash.utils.Timer;

  public declare timerCounter: number;

  public declare timerInc: number;

  public constructor() {
    this.frameBased = true;
    this.completeString = "";
    this.timerCounter = 0;
    this.timerInc = 0;
  }

  public getFrameTime(): any {
    return this.timerCounter;
  }

  public getRealTime(numb: number): any {
    return StopWatch.translateTime(numb);
  }

  public getTimeAsSeconds(): any {
    return Math.floor(this.timerCounter / StopWatch.fr) % 60;
  }

  public getTimeAsString(): any {
    return this.completeString;
  }

  public getTimeAsTotalSeconds(): any {
    return Math.floor(this.timerCounter / StopWatch.fr);
  }

  public handleCounter(): any {
    if (this.frameBased) {
      this.timerCounter = this.timerCounter + 1;
      this.completeString = StopWatch.translateTime(this.timerCounter);
    }
  }

  public initTimer(timeRate: number = 1000): any {
    this.frameBased = false;
    this.timer = new lib.flash.utils.Timer(timeRate);
    this.timerInc = timeRate;
    this.timer.addEventListener("timer", this.timerHandler);
    this.timer.start();
  }

  public killTimer(): any {
    if (this.timer) {
      this.timer.stop();
      this.timer.removeEventListener("timer", this.timerHandler);
    }
  }

  public ping(): any {
    this.handleCounter();
  }

  public resetTime(): any {
    this.timerCounter = 0;
  }

  public setTime(num: number): any {
    this.timerCounter = num;
  }

  public setTimeAsTotalSeconds(num: number): any {
    this.timerCounter = num * StopWatch.fr;
  }

  public timerHandler(e: lib.flash.events.TimerEvent): void {
    this.timerCounter =
      this.timerCounter + Math.ceil((StopWatch.fr * this.timerInc) / 1000);
  }

  public static translateTime(num: number): any {
    var realMili: any = null;
    var realSec: any = null;
    var realMin: any = null;
    var mili: number = Math.round(((num % StopWatch.fr) / StopWatch.fr) * 100);
    if (mili < 10) {
      realMili = "0" + mili;
    } else {
      realMili = String(mili);
    }
    var sec: number = Math.floor(num / StopWatch.fr) % 60;
    if (sec < 10) {
      realSec = "0" + sec;
    } else {
      realSec = String(sec);
    }
    var minute: number = Math.floor(num / (StopWatch.fr * 60));
    if (minute < 10) {
      realMin = "0" + minute;
    } else {
      realMin = String(minute);
    }
    return realMin + ":" + realSec + "." + realMili;
  }
}
