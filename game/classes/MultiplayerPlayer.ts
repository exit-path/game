import lib from "swf-lib";

export class MultiplayerPlayer extends lib.flash.display.MovieClip {
  public declare id: number;

  public declare userName: string;

  public constructor() {
    super();
    this.id = 0;
    this.userName = "bob";
  }
}
