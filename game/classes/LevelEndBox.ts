import lib from "swf-lib";
import { Runner } from "./Runner";
import { Text2 } from "./john/Text2";
import { Anim } from "./john/Anim";
import { PlayerShell } from "./PlayerShell";

export class LevelEndBox extends lib.flash.display.MovieClip {
  public declare backdrop: lib.flash.display.MovieClip;

  public declare giveKudo: lib.flash.display.MovieClip;

  public declare kudoImage: lib.flash.display.MovieClip;

  public declare kudos: lib.flash.text.TextField;

  public declare kudosRound: number;

  public declare kudosThisRound: lib.flash.text.TextField;

  public declare levelNum: lib.flash.text.TextField;

  public declare levelTitle: lib.flash.text.TextField;

  public declare matchNum: lib.flash.text.TextField;

  public declare player: PlayerShell;

  public declare playerInfo: lib.flash.text.TextField;

  public declare side: lib.flash.display.MovieClip;

  public declare skinner: Runner;

  public declare totXP: number;

  public declare wins: lib.flash.text.TextField;

  public declare xp: lib.flash.text.TextField;

  public declare xpRound: number;

  public declare xpThisRound: lib.flash.text.TextField;

  public constructor() {
    super();
    this.kudosRound = 0;
    this.totXP = 0;
    this.xpRound = 0;
  }

  public init(plyr: PlayerShell): any {
    this.player = plyr;
    this.updateBox();
  }

  public updateBox(): any {
    this.playerInfo.text = this.player.userName;
    this.xp.text = Text2.commaSnob(this.player.xp) + " XP";
    this.totXP = this.player.xp;
    this.levelTitle.text = this.parent.parent.parent["getRankByXP"](this.totXP);
    this.levelNum.text = this.parent.parent.parent["getLevelByXP"](this.totXP);
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
  }

  public updateKudos(num: number): any {
    this.kudosRound = this.kudosRound + num;
    this.kudosThisRound.text = "+" + this.kudosRound;
    if (num > 0) {
    }
  }

  public updateXP(num: number): any {
    this.xpRound = this.xpRound + num;
    this.xpThisRound.text = Text2.commaSnob(this.xpRound) + " XP";
  }
}
