import lib from "swf-lib";

export class EndCountdown extends lib.flash.display.MovieClip {
  public declare timeOf: lib.flash.text.TextField;

  public declare whoBeat: lib.flash.text.TextField;

  public user: string;
  public timer = 15;

  public constructor(str: string) {
    super();
    this.user = str;
    this.whoBeat.text = this.user + " just beat the level!";
  }

  public ping(xPos: number, yPos: number): any {
    this.x = xPos;
    this.y = yPos;
    this.timeOf.text = String(this.timer);
  }
}
