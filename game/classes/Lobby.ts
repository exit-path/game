import lib from "swf-lib";
import { LevelUpWindow } from "./LevelUpWindow";
import { StopWatch } from "./john/StopWatch";
import { Tubes } from "./Tubes";
import { Placing } from "./Placing";
import { Relay } from "./john/Relay";
import { Text2 } from "./john/Text2";
import { Anim } from "./john/Anim";
import { PlayerShell } from "./PlayerShell";

export class Lobby extends lib.flash.display.MovieClip {
  public declare backToMenuButton: lib.flash.display.SimpleButton;

  public declare bars: Placing[];

  public declare kudosLeft: lib.flash.text.TextField;

  public declare levelName: lib.flash.text.TextField;

  public declare levelRank: lib.flash.text.TextField;

  public declare levelUpWindow: LevelUpWindow;

  public declare nextInfo: lib.flash.text.TextField;

  public declare players: PlayerShell[];

  public declare ranking: any[];

  public declare timer: StopWatch;

  public declare timeToGo: number;

  public declare tubes: Tubes;

  public declare xpAndLevel: lib.flash.text.TextField;

  public declare xpBar: lib.flash.display.MovieClipT<{
    barIn: lib.flash.display.MovieClip;
  }>;

  public declare xpDisp: lib.flash.text.TextField;

  public declare xpTill: lib.flash.text.TextField;

  public constructor() {
    super();
    this.timeToGo = 5;
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
    bar.kudosButton.addEventListener(lib.flash.events.MouseEvent.CLICK, () =>
      this.giveKudo(bar)
    );
    bar.kudosButton.visible = false;
    if (this.levelUpWindow && this.contains(this.levelUpWindow)) {
      this.addChild(this.levelUpWindow);
    }
  }

  public backTo(e: lib.flash.events.MouseEvent): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "Lobby", "Back"));
  }

  public frame1(): any {
    this.stop();
    this.dispatchEvent(new Relay(Relay.SEND, "Results", "Init"));
  }

  private giveKudo(bar: Placing) {
    this.tubes.giveKudo(bar.boxy.player);
    const index = this.players.findIndex((p) => p.isPlayer);
    this.players[index].kudosToGive--;
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
    for (var i: any = 0; i < this.bars.length; i++) {
      if (this.bars[i].sMute.hitTestPoint(this.mouseX, this.mouseY)) {
        if (this.tubes.isPlayerMuted(this.players[i])) {
          this.tubes.unMutePlayer(this.players[i]);
          this.bars[i].sMute.gotoAndStop(1);
          return;
        }
        this.tubes.mutePlayer(this.players[i]);
        this.bars[i].sMute.gotoAndStop(2);
        return;
      }
    }
  }

  public ping(e: lib.flash.events.Event = null): any {
    if (!this.parent) {
      return;
    }
    if (this.players.length > 1) {
      this.nextInfo.text =
        "Next game will start in " + this.timeToGo + " second(s)";
    } else {
      this.nextInfo.text = "Waiting for more players...";
    }
    this.sortPlayers();
    const playerData = this.tubes.player ?? this.tubes.multiplayer.playerObject;
    this.xpDisp.text = Text2.commaSnob(playerData.xp) + " XP";
    var curLevel: number = this.parent["getLevelByXP"](playerData.xp);
    var curRank: string = this.parent["getRankByXP"](playerData.xp);
    var nextLevelXP: number = this.parent["ranks"][curLevel + 1];
    var curLevelXP: number = this.parent["ranks"][curLevel];
    var nextXP: number = nextLevelXP - playerData.xp;
    this.xpAndLevel.text = String(curLevel);
    this.xpTill.text = Text2.commaSnob(nextXP) + " XP until the next Level";
    this.xpBar.barIn.scaleX = Anim.ease(
      this.xpBar.barIn.scaleX,
      (playerData.xp - curLevelXP) / (nextLevelXP - curLevelXP),
      0.3
    );
    this.levelRank.text = curRank;

    const player = this.players.find((shell) => shell.isPlayer);
    if (player && this.tubes.room.rewards.some((r) => r.id === player.id)) {
      this.kudosLeft.text = "Kudos To Give: " + player.kudosToGive;
    }
    for (const disp of this.bars) {
      disp.kudosButton.visible =
        !disp.boxy.player.isPlayer &&
        !disp.boxy.isNew &&
        player &&
        player.kudosToGive > 0;
    }
  }

  public removeBar(pos: number): any {
    this.removeChild(this.bars[pos]);
    this.bars[pos] = null;
    this.bars.splice(pos, 1);
  }

  public sendMessage(e: lib.flash.events.MouseEvent = null): any {}

  public sortPlayers(): any {
    const placings = new Map(
      this.tubes.room.rewards.map((r) => [r.id, r.placing])
    );
    const lastRank = placings.size + 1;
    const rankedPlayers = this.players
      .slice()
      .sort(
        (a, b) =>
          (placings.get(a.id) ?? lastRank + a.id) -
          (placings.get(b.id) ?? lastRank + b.id)
      );
    for (let i = 0; i < this.players.length; i++) {
      this.bars[i].x = 50;
      this.bars[i].y = Anim.ease(
        this.bars[i].y,
        100 + rankedPlayers.indexOf(this.players[i]) * 50,
        0.3
      );
    }
  }

  public updateBar(pos: number): any {
    var i: number = pos;
    var disp = this.bars[i];
    var player = this.players[i];
    if (!disp || !player) {
      return;
    }
    disp.x = 50;
    disp.boxy.init(player);
    if (this.tubes.room.rewards.some((r) => r.id === player.id)) {
      disp.timeDisp.text =
        player.time > 0 ? this.timer.getRealTime(player.time) : "No Finish";
      disp.placingNum.text = String(player.placing);
      disp.boxy.kudoImage.visible = true;
      disp.boxy.isNew = false;
    } else {
      disp.timeDisp.text = "New!";
      disp.placingNum.text = "-";
      disp.boxy.kudoImage.visible = false;
      disp.boxy.isNew = true;
    }
    if (player.isPlayer == true) {
      disp.playerBorder.visible = true;
      disp.sMute.visible = false;
    } else {
      disp.playerBorder.visible = false;
    }
    if (this.tubes.isPlayerMuted(player)) {
      disp.sMute.gotoAndStop(2);
    } else {
      disp.sMute.gotoAndStop(1);
    }
    disp.boxy.updateBox();
  }

  public checkLevelUp(oldXP: number, newXP: number) {
    const oldLevel: number = this.parent["getLevelByXP"](oldXP);
    const newLevel: number = this.parent["getLevelByXP"](newXP);
    if (newLevel <= oldLevel) {
      return;
    }

    const levelTitle: string = this.parent["getRankByXP"](newXP);
    this.levelUpWindow = new LevelUpWindow();
    this.levelUpWindow.init(newLevel, levelTitle);
    this.addChild(this.levelUpWindow);
  }
}
