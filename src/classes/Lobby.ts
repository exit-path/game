import lib from "swf-lib";
import { LevelUpWindow } from "./LevelUpWindow";
import { StopWatch } from "./john/StopWatch";
import { Tubes } from "./Tubes";
import { Placing } from "./Placing";
import { Relay } from "./john/Relay";
import { AchEvent } from "./AchEvent";
import { DebugUtil } from "./betz/DebugUtil";
import { Key } from "./john/Key";
import { Text2 } from "./john/Text2";
import { Anim } from "./john/Anim";
import { Log } from "./SWFStats/Log";

export class Lobby extends lib.flash.display.MovieClip {
  public declare backToMenuButton: lib.flash.display.SimpleButton;

  public declare bars: any[];

  public declare kudosLeft: lib.flash.text.TextField;

  public declare levelName: lib.flash.text.TextField;

  public declare levelRank: lib.flash.text.TextField;

  public declare levelUpWindow: LevelUpWindow;

  private declare newLevel: number;

  private declare newXP: number;

  public declare nextInfo: lib.flash.text.TextField;

  private declare oldLevel: number;

  private declare oldXP: number;

  public declare players: any[];

  public declare ranking: any[];

  public declare returning: boolean;

  public declare sendButton: lib.flash.display.SimpleButton;

  public declare texter: lib.flash.text.TextField;

  public declare timer: StopWatch;

  public declare timeToGo: number;

  public declare tubes: Tubes;

  public declare xpAndLevel: lib.flash.text.TextField;

  public declare xpBar: lib.flash.display.MovieClip;

  public declare xpDisp: lib.flash.text.TextField;

  public declare xpTill: lib.flash.text.TextField;

  public constructor() {
    super();
    this.newXP = 0;
    this.oldLevel = 0;
    this.timeToGo = 5;
    this.newLevel = 0;
    this.returning = false;
    this.oldXP = 0;
    this.players = new Array<any>();
    this.bars = new Array<any>();
    this.ranking = new Array<any>();
    this.timer = new StopWatch();
    this.addFrameScript(0, this.frame1);
  }

  public addBar(): any {
    var bar: Placing = new Placing();
    this.addChild(bar);
    this.bars.push(bar);
    bar.kudosButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.giveKudo,
      false,
      0,
      true
    );
    bar.kudosButton.visible = false;
    if (this.levelUpWindow && this.contains(this.levelUpWindow)) {
      this.addChild(this.levelUpWindow);
    }
  }

  public backTo(e: lib.flash.events.MouseEvent): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "Lobby", "Back"));
  }

  public exchangeKudos(to: string, from: string): any {
    for (var i: any = 0; i < this.players.length; i++) {
      if (this.players[i].userName == to) {
        this.bars[i].boxy.giveKudo.play();
        this.bars[i].boxy.updateXP(25);
        this.bars[i].boxy.updateKudos(1);
        if (this.players[i].isPlayer) {
          if (this.bars[i].boxy.kudosRound >= 5) {
            this.dispatchEvent(new AchEvent(AchEvent.SEND, 34));
          }
          if (this.bars[i].boxy.kudosRound >= 7) {
            this.dispatchEvent(new AchEvent(AchEvent.SEND, 35));
          }
        }
        return;
      }
    }
  }

  public frame1(): any {
    this.stop();
    this.dispatchEvent(new Relay(Relay.SEND, "Results", "Init"));
  }

  public giveKudo(e: lib.flash.events.MouseEvent): any {
    var j: any = NaN;
    for (var i: any = 0; i < this.bars.length; i++) {
      if (this.bars[i] == e.currentTarget.parent) {
        this.tubes.sendMessage("kudokudo" + this.players[i].userName);
      }
      if (this.players[i].isPlayer) {
        this.players[i].kudosToGive--;
        this.kudosLeft.text = "Kudos To Give: " + this.players[i].kudosToGive;
        if (this.players[i].kudosToGive <= 0) {
          for (j = 0; j < this.bars.length; j++) {
            this.bars[j].kudosButton.visible = false;
          }
          this.kudosLeft.text = "Kudos To Give: 0";
        }
      }
    }
  }

  public init(tubers: Tubes): any {
    this.tubes = tubers;
    this.backToMenuButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.backTo,
      false,
      0,
      true
    );
    this.sendButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.sendMessage,
      false,
      0,
      true
    );
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.ping,
      false,
      0,
      true
    );
    this.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.mouseClick,
      false,
      0,
      true
    );
    this.texter.setSelection(0, 0);
    this.stage.focus = this.texter;
    this.texter.text = "";
    this.players = this.tubes.players;
    this.initPlayers();
  }

  private initPlayers(): any {
    for (var i: any = 0; i < this.players.length; i++) {
      this.addBar();
      this.updateBar(i);
      this.bars[i].kudosButton.visible = false;
    }
  }

  public kill(): any {
    this.sendButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.sendMessage
    );
    this.backToMenuButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.backTo
    );
    this.removeEventListener(lib.flash.events.Event.ENTER_FRAME, this.ping);
    this.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.mouseClick
    );
  }

  public mouseClick(e: lib.flash.events.MouseEvent = null): any {
    DebugUtil.out("CLICK!");
    DebugUtil.out("barskebgth!", this.bars.length);
    for (var i: any = 0; i < this.bars.length; i++) {
      if (this.bars[i].sMute.hitTestPoint(this.mouseX, this.mouseY)) {
        DebugUtil.out("HIT " + this.bars[i]);
        if (this.tubes.isPlayerMuted(this.players[i].userName)) {
          DebugUtil.out("Player is muted, will unmute");
          this.tubes.unMutePlayer(this.players[i].userName);
          this.bars[i].sMute.gotoAndStop(1);
          return;
        }
        DebugUtil.out("Player is unmuted, will mute");
        this.tubes.mutePlayer(this.players[i].userName);
        this.bars[i].sMute.gotoAndStop(2);
        return;
      }
    }
    DebugUtil.out("NO HIT!");
  }

  public ping(e: lib.flash.events.Event = null): any {
    if (Key.isDown(lib.flash.ui.Keyboard.ENTER)) {
      this.sendMessage();
    }
    if (this.players.length > 1) {
      this.nextInfo.text =
        "Next game will start in " + this.timeToGo + " second(s)";
    } else {
      this.nextInfo.text = "Waiting for more players...";
    }
    this.sortPlayers();
    this.tubes.ping();
    this.xpDisp.text = Text2.commaSnob(this.tubes.playerObject.xp) + " XP";
    var curLevel: number = this.parent["getLevelByXP"](
      this.tubes.playerObject.xp
    );
    var curRank: string = this.parent["getRankByXP"](
      this.tubes.playerObject.xp
    );
    var nextLevelXP: number = this.parent["ranks"][curLevel + 1];
    var curLevelXP: number = this.parent["ranks"][curLevel];
    var nextXP: number = nextLevelXP - this.tubes.playerObject.xp;
    var levelProgXP: number = curLevelXP - nextXP;
    this.xpAndLevel.text = String(curLevel);
    this.xpTill.text = Text2.commaSnob(nextXP) + " XP until the next Level";
    this.xpBar.barIn.scaleX = Anim.ease(
      this.xpBar.barIn.scaleX,
      (this.tubes.playerObject.xp - curLevelXP) / (nextLevelXP - curLevelXP),
      0.3
    );
    this.levelRank.text = curRank;
  }

  public removeBar(pos: number): any {
    this.bars[pos].kudosButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.giveKudo
    );
    this.removeChild(this.bars[pos]);
    this.bars[pos] = null;
    this.bars.splice(pos, 1);
  }

  public reRank(): any {}

  public returnFromGame(): any {
    this.returning = true;
    this.tubes.timeToGo = this.tubes.timeToGoStart;
    for (var i: any = 0; i < this.players.length; i++) {
      this.players[i].matches++;
      if (this.players[i].isPlayer) {
        this.oldXP = this.tubes.playerObject.xp;
        this.oldLevel = this.parent["getLevelByXP"](this.tubes.playerObject.xp);
        if (this.players[i].host) {
          this.tubes.setRoomVariable("state", "Lobby");
          this.tubes.resetTimeToGo();
          Log.CustomMetric("MPGame");
        }
        this.tubes.playerObject.matches++;
        this.dispatchEvent(new AchEvent(AchEvent.SEND, 15));
        this.bars[i].kudosButton.visible = false;
      } else {
        this.bars[i].kudosButton.visible = true;
      }
      if (this.players[i].placing == 0) {
        this.players[i].kudosToGive = this.players[i].kudosToGive + 3;
        this.players[i].xp = this.players[i].xp + 250;
        this.players[i].wins++;
        this.updateBar(i);
        this.bars[i].boxy.updateXP(250);
        this.bars[i].boxy.kudosThisRound.text = "0";
        if (this.players[i].isPlayer) {
          this.tubes.playerObject.xp = this.tubes.playerObject.xp + 250;
          this.tubes.playerObject.wins++;
          if (this.tubes.playerObject.wins >= 1) {
            this.dispatchEvent(new AchEvent(AchEvent.SEND, 24));
          }
          if (this.tubes.playerObject.wins >= 10) {
            this.dispatchEvent(new AchEvent(AchEvent.SEND, 25));
          }
          if (this.tubes.playerObject.wins >= 100) {
            this.dispatchEvent(new AchEvent(AchEvent.SEND, 26));
          }
        }
      } else if (this.players[i].placing == 1) {
        this.players[i].kudosToGive = this.players[i].kudosToGive + 2;
        this.players[i].xp = this.players[i].xp + 150;
        this.updateBar(i);
        this.bars[i].boxy.updateXP(150);
        this.bars[i].boxy.kudosThisRound.text = "0";
        if (this.players[i].isPlayer) {
          this.tubes.playerObject.xp = this.tubes.playerObject.xp + 150;
        }
      } else if (this.players[i].placing == 2) {
        this.players[i].kudosToGive = this.players[i].kudosToGive + 1;
        this.players[i].xp = this.players[i].xp + 100;
        this.updateBar(i);
        this.bars[i].boxy.updateXP(100);
        this.bars[i].boxy.kudosThisRound.text = "0";
        if (this.players[i].isPlayer) {
          this.tubes.playerObject.xp = this.tubes.playerObject.xp + 100;
        }
      } else {
        this.players[i].kudosToGive = this.players[i].kudosToGive + 0;
        this.players[i].xp = this.players[i].xp + 25;
        this.tubes.playerObject.xp = this.tubes.playerObject.xp + 25;
        this.updateBar(i);
        this.bars[i].boxy.updateXP(25);
        this.bars[i].boxy.kudosThisRound.text = "0";
        if (this.players[i].isPlayer) {
          this.tubes.playerObject.xp = this.tubes.playerObject.xp + 25;
        }
      }
    }
    this.tubes.chooseUserLevel();
    var levelTitle: string = this.parent["getRankByXP"](
      this.tubes.playerObject.xp
    );
    var levelNum: number = this.parent["getLevelByXP"](
      this.tubes.playerObject.xp
    );
    if (levelNum > this.oldLevel) {
      this.levelUpWindow = new LevelUpWindow();
      this.levelUpWindow.init(levelNum, levelTitle);
      this.addChild(this.levelUpWindow);
      for (i = 0; i < this.players[i]; i++) {
        if (this.players[i].isPlayer) {
          this.updateBar(i);
        }
      }
      this.tubes.sendMessage(
        "LVX" +
          this.tubes.playerObject.userName +
          " has just leveled up to Level " +
          levelNum +
          ": " +
          levelTitle
      );
    }
    this.dispatchEvent(new Relay(Relay.GOTO, "SaveGame"));
    var matches: number = this.tubes.playerObject.matches;
    if (matches >= 5) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 30));
    }
    if (matches >= 25) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 31));
    }
    if (matches >= 100) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 32));
    }
    if (matches >= 250) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 33));
    }
    if (levelNum >= 3) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 36));
    }
    if (levelNum >= 5) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 37));
    }
    if (levelNum >= 8) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 38));
    }
    if (levelNum >= 10) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 39));
    }
    if (levelNum >= 15) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 40));
    }
    if (levelNum >= 20) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 41));
    }
    if (levelNum >= 25) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 42));
    }
    if (levelNum >= 30) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 43));
    }
    if (levelNum >= 35) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 44));
    }
    if (levelNum >= 38) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 45));
    }
    if (levelNum >= 39) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 46));
    }
    if (levelNum >= 40) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 47));
    }
  }

  public sendMessage(e: lib.flash.events.MouseEvent = null): any {
    if (
      this.texter.text == "" ||
      this.texter.text == " " ||
      this.texter.text == "\n" ||
      this.texter.text == " \n" ||
      this.texter.text.length <= 1
    ) {
      this.texter.text = "";
      this.stage.focus = this.texter;
      return;
    }
    if (Key.isDown(lib.flash.ui.Keyboard.ENTER)) {
      this.texter.text = this.texter.text.substr(
        0,
        this.texter.text.length - 1
      );
    } else {
      this.texter.text = this.texter.text.substr(0, this.texter.text.length);
    }
    this.tubes.sendMessage("!!" + this.texter.text);
    this.texter.text = "";
    this.stage.focus = this.texter;
  }

  public sortPlayers(): any {
    var j: any = NaN;
    for (var i: any = 0; i < this.players.length; i++) {
      this.bars[i].x = 50;
      for (j = 0; j < this.tubes.finalList.length; j++) {
        if (this.tubes.finalList[j] == this.players[i]) {
          this.bars[i].y = Anim.ease(this.bars[i].y, 100 + j * 50, 0.3);
        }
      }
    }
  }

  public updateBar(pos: number): any {
    var i: number = pos;
    var disp: lib.flash.display.MovieClip = this.bars[i];
    var player: lib.flash.display.MovieClip = this.players[i];
    if (!disp || !player) {
      return;
    }
    disp.x = 50;
    disp.boxy.init(player);
    disp.placingNum.text = String(player.placing + 1);
    if (player.completedLevel) {
      disp.timeDisp.text = this.timer.getRealTime(player.time);
    } else if (this.returning) {
      disp.timeDisp.text = "No Finish";
      disp.boxy.kudoImage.visible = true;
    } else {
      disp.timeDisp.text = "New!";
      disp.boxy.xpThisRound.text = " ";
      disp.boxy.kudosThisRound.text = " ";
      disp.boxy.kudoImage.visible = false;
    }
    if (player.isPlayer == true) {
      if (i == 0) {
      }
      disp.playerBorder.visible = true;
      disp.kudosButton.visible = false;
      if (player.kudosToGive > 0) {
        this.kudosLeft.text = "Kudos To Give: " + player.kudosToGive;
      }
      disp.sMute.visible = false;
    } else {
      disp.playerBorder.visible = false;
    }
    if (this.tubes.isPlayerMuted(player.userName)) {
      disp.sMute.gotoAndStop(2);
    } else {
      disp.sMute.gotoAndStop(1);
    }
    disp.boxy.updateBox();
  }

  public updateKudosToGive(): any {
    for (var i: any = 0; i < this.players.length; i++) {
      if (this.players[i].isPlayer) {
        if (this.players[i].kudosToGive > 0) {
          this.kudosLeft.text = "Kudos To Give: " + this.players[i].kudosToGive;
        } else {
          this.kudosLeft.text = "Kudos To Give: 0";
        }
        return;
      }
      this.bars[i].kudosButton.visible = true;
    }
  }
}
