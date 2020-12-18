import lib from "swf-lib";
import { ExternalEvent } from "./ExternalEvent";
import { Relay } from "./john/Relay";
import { Text2 } from "./john/Text2";
import { Runner } from "./Runner";

export class MultiplayerMenu extends lib.flash.display.MovieClip {
  public declare backToMenuButton: lib.flash.display.SimpleButton;

  public declare customizeButton: lib.flash.display.SimpleButton;

  public declare nameDisp: lib.flash.text.TextField;

  public declare playerInfo: lib.flash.display.MovieClipT<{
    xpAndLevel: lib.flash.text.TextField;
    xpBar: lib.flash.display.MovieClipT<{
      barIn: lib.flash.display.MovieClip;
    }>;
    xpDisp: lib.flash.text.TextField;
    xpTill: lib.flash.text.TextField;
    kudosDisp: lib.flash.text.TextField;
    matchDisp: lib.flash.text.TextField;
    winDisp: lib.flash.text.TextField;
  }>;

  public declare playerObject: any;

  public declare qp: lib.flash.display.SimpleButton;

  public declare runnerBar: lib.flash.display.MovieClipT<{
    runner: Runner;
  }>;

  public constructor() {
    super();
  }

  public buttons(e: lib.flash.events.MouseEvent): any {
    switch (e.currentTarget) {
      case this.qp:
        this.dispatchEvent(new ExternalEvent({ type: "connect-multiplayer" }));
        break;
      case this.backToMenuButton:
        this.dispatchEvent(new Relay(Relay.GOTO, "MultiplayerMenu", "Back"));
    }
  }

  public customGo(e: lib.flash.events.MouseEvent): any {
    this.dispatchEvent(
      new Relay(Relay.GOTO, "MultiplayerMenu", "CharacterSelection")
    );
  }

  public init(playerOb: any): any {
    this.playerObject = playerOb;
    this.qp.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.backToMenuButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.customizeButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.customGo,
      false,
      0,
      true
    );
    this.nameDisp.text = "Welcome, " + this.playerObject.userName + "!";
    this.playerInfo.xpDisp.text = Text2.commaSnob(this.playerObject.xp) + " XP";
    this.playerInfo.kudosDisp.text =
      Text2.commaSnob(this.playerObject.kudos) + " Kudos";
    this.playerInfo.winDisp.text =
      Text2.commaSnob(this.playerObject.wins) + " Wins";
    this.playerInfo.matchDisp.text =
      Text2.commaSnob(this.playerObject.matches) + " Matches";
    var curLevel: number = this.parent["getLevelByXP"](this.playerObject.xp);
    var curRank: string = this.parent["getRankByXP"](this.playerObject.xp);
    var nextLevelXP: number = this.parent["ranks"][curLevel + 1];
    var curLevelXP: number = this.parent["ranks"][curLevel];
    var nextXP: number = nextLevelXP - this.playerObject.xp;
    this.playerInfo.xpAndLevel.text = curLevel + " " + curRank;
    this.playerInfo.xpTill.text =
      Text2.commaSnob(nextXP) + " XP until the next Level";
    this.playerInfo.xpBar.barIn.scaleX =
      (this.playerObject.xp - curLevelXP) / (nextLevelXP - curLevelXP);
    this.runnerBar.runner.gotoAndStop(2);
    this.runnerBar.runner.colour = this.playerObject.colour;
    this.runnerBar.runner.colour2 = this.playerObject.colour2;
    this.runnerBar.runner.headType = this.playerObject.headType;
    this.runnerBar.runner.handType = this.playerObject.handType;
    this.runnerBar.runner.fuel();
  }

  public kill(): any {
    this.qp.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.backToMenuButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.customizeButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.customGo
    );
  }
}
