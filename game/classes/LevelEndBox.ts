import lib from "swf-lib";
import { Runner } from "./Runner";
import { Text2 } from "./john/Text2";
import { Anim } from "./john/Anim";
import { PlayerShell } from "./PlayerShell";
import { SoundBox } from "./john/SoundBox";

export class LevelEndBox extends lib.flash.display.MovieClip {
  public declare backdrop: lib.flash.display.MovieClip;

  public declare giveKudo: lib.flash.display.MovieClip;

  public declare kudoImage: lib.flash.display.MovieClip;

  public declare kudos: lib.flash.text.TextField;

  public declare kudosThisRound: lib.flash.text.TextField;

  public declare levelNum: lib.flash.text.TextField;

  public declare levelTitle: lib.flash.text.TextField;

  public declare matchNum: lib.flash.text.TextField;

  public declare player: PlayerShell;

  public declare playerInfo: lib.flash.text.TextField;

  public declare side: lib.flash.display.MovieClip;

  public declare skinner: Runner;

  public declare wins: lib.flash.text.TextField;

  public declare xp: lib.flash.text.TextField;

  public declare xpThisRound: lib.flash.text.TextField;

  private roundXP: number | null = null;
  private roundKudos: number | null = null;

  public isNew = false;

  public constructor() {
    super();
  }

  public init(plyr: PlayerShell): any {
    this.player = plyr;
    this.updateBox();
  }

  public updateBox(): any {
    this.playerInfo.text = this.player.userName;
    this.xp.text = Text2.commaSnob(this.player.xp) + " XP";
    const xp = this.player.xp;
    this.levelTitle.text = this.parent.parent.parent["getRankByXP"](xp);
    this.levelNum.text = this.parent.parent.parent["getLevelByXP"](xp);
    this.kudos.text = Text2.commaSnob(this.player.kudos);
    this.matchNum.text = Text2.commaSnob(this.player.matches) + " Matches";
    this.wins.text = Text2.commaSnob(this.player.wins) + " Wins";
    this.skinner.colour = this.player.colour;
    this.skinner.colour2 = this.player.colour2;
    this.skinner.headType = this.player.headType;
    this.skinner.handType = this.player.handType;
    Anim.colourMe(this.backdrop, this.player.colour);
    Anim.colourMe(this.side, this.player.colour2);
    this.skinner.fuel();

    const { kudoReceived, xpRound } = this.player;
    if (this.isNew) {
      this.roundKudos = null;
      this.kudosThisRound.text = " ";
    } else if (this.roundKudos !== kudoReceived) {
      if (kudoReceived > (this.roundKudos ?? kudoReceived)) {
        SoundBox.playSound("GetKudos");
        this.giveKudo.play();
      }
      this.roundKudos = kudoReceived;
      this.kudosThisRound.text = kudoReceived > 0 ? "+" + kudoReceived : "0";
    }

    if (this.isNew) {
      this.roundXP = null;
      this.xpThisRound.text = " ";
    } else if (this.roundXP !== xpRound) {
      this.roundXP = xpRound;
      this.xpThisRound.text = Text2.commaSnob(xpRound) + " XP";
    }
  }
}
