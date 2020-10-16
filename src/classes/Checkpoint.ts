import lib from "swf-lib";
import { CheckpointFlag } from "./CheckpointFlag";
import { Anim } from "./john/Anim";
import { Relay } from "./john/Relay";

interface CheckpointPlayer extends lib.flash.display.MovieClip {
  isMain: boolean;
}

export class Checkpoint extends lib.flash.display.MovieClip {
  public declare checkPointFlags: CheckpointFlag[];

  public declare id: number;

  public declare playerList: CheckpointPlayer[];

  public constructor() {
    super();
    this.id = 0;
    this.checkPointFlags = new Array<any>();
    this.playerList = new Array<any>();
  }

  public addFlag(mov: CheckpointPlayer, colour: number, colour2: number): any {
    var flag: any = null;
    for (var i: any = 0; i < this.playerList.length; i++) {
      if (mov == this.playerList[i]) {
        return;
      }
    }
    this.playerList.push(mov);
    flag = new CheckpointFlag();
    flag.x = 0;
    flag.y = this.checkPointFlags.length * (flag.height / 2) - 40;
    Anim.colourMe(flag.flag.parts1, colour);
    Anim.colourMe(flag.flag.parts2, colour2);
    this.checkPointFlags.push(flag);
    this.addChild(flag);
    if (mov.isMain) {
      this.dispatchEvent(new Relay(Relay.SEND, "CHECK"));
    }
  }

  public isNew(mov: lib.flash.display.MovieClip): any {
    for (var i: any = 0; i < this.playerList.length; i++) {
      if (mov == this.playerList[i]) {
        return false;
      }
    }
    return true;
  }
}
