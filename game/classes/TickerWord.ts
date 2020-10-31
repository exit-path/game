import lib from "swf-lib";
import { Ticker } from "./Ticker";

export class TickerWord extends lib.flash.display.MovieClip {
  public declare bg: lib.flash.display.MovieClip;

  public declare tickers: Ticker[];

  public declare word: string;

  public constructor(str: string = null) {
    super();
    var tick: any = null;
    this.tickers = new Array<any>();
    this.word = "";
    this.bg.visible = false;
    if (str == null) {
      str = this.name;
    }
    this.word = str;
    for (var i: any = 0; i < str.length; i++) {
      tick = new Ticker(str.substr(i, 1), true);
      tick.x = i * tick.width + 2;
      tick.y = 0;
      this.addChild(tick);
      this.tickers.push(tick);
    }
  }

  public changeString(str: string, instant: boolean = false): any {
    var tick: any = null;
    this.word = str;
    for (var i: any = 0; i < this.tickers.length; i++) {
      tick = this.tickers[i];
      if (str.substr(i, 1) != tick.characters[tick.goalCharacter]) {
        tick.newCharacter(str.substr(i, 1), instant);
      }
    }
    if (str.length > this.tickers.length) {
      for (i = Number(this.tickers.length); i < str.length; i++) {
        tick = new Ticker(str.substr(i, 1), true);
        tick.x = i * tick.width + 2;
        tick.y = 0;
        this.addChild(tick);
        this.tickers.push(tick);
      }
    }
    var newWord: string = "";
    for (i = 0; i < this.tickers.length; i++) {
      newWord =
        newWord + this.tickers[i].characters[this.tickers[i].goalCharacter];
    }
    this.word = newWord;
  }

  public ping(): any {
    for (const ticker of this.tickers) {
      ticker.ping();
    }
  }
}
