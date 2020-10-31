import lib from "swf-lib";
import { HandyCam } from "./john/HandyCam";
import { Player } from "./Player";
import { Anim } from "./john/Anim";
import { SoundBox } from "./john/SoundBox";
import { Exit_fla } from ".";
import { main } from "./global";
import { LevelFlags } from "../../shared/level";

export class UIPanel extends lib.flash.display.MovieClip {
  public declare arrowKeysToPan: lib.flash.display.MovieClip;

  public declare bordering: lib.flash.display.MovieClip;

  public declare buildVersion: lib.flash.text.TextField;

  public declare caution: Exit_fla.cautionSign_anim_444;

  public declare exitButton: lib.flash.display.SimpleButton;

  public declare flow: lib.flash.display.MovieClipT<{
    flowInside: lib.flash.display.MovieClipT<{
      flowBar: lib.flash.display.MovieClip;
    }>;
    flowReady: lib.flash.display.MovieClipT<{}>;
  }>;

  public declare flowCount: number;

  private declare handyCam: HandyCam;

  public declare levDisplay: lib.flash.text.TextField;

  public declare levelNum: number;

  public declare levName: lib.flash.text.TextField;

  public declare muteButton: lib.flash.display.SimpleButton;

  public declare pauseButton: lib.flash.display.SimpleButton;

  public declare placing: lib.flash.display.MovieClipT<{
    positionNum: lib.flash.text.TextField;
    totalPlayers: lib.flash.text.TextField;
    nth: lib.flash.text.TextField;
  }>;

  public declare player: Player;

  public declare qualityButton: lib.flash.display.SimpleButton;

  public declare timeDisp: lib.flash.text.TextField;

  public constructor() {
    super();
    this.flowCount = 0;
    this.levelNum = 0;
    this.flow.flowInside.flowBar.scaleX = 0;
  }

  public movePanel(): any {
    this.x = 0 - this.handyCam.camX;
    this.y = 0 - this.handyCam.camY;
  }

  public movePlayer(): any {}

  public ping(hCam: HandyCam, plyr: Player): any {
    this.handyCam = hCam;
    this.player = plyr;
    this.movePanel();
    this.updateFlow();
  }

  public updateFlow(): any {
    const level = main().multiplayer?.game?.level;
    if (!level) {
      return;
    }
    const flowMode = level.flags & LevelFlags.FlowModeMask;

    switch (flowMode) {
      case LevelFlags.FlowDisabled:
        this.flow.visible = false;
        return;

      case LevelFlags.FlowNormal:
        this.flow.visible = true;
        this.flow.flowInside.flowBar.scaleX = Anim.ease(
          this.flow.flowInside.flowBar.scaleX,
          this.player.flowPoints / 400,
          0.9
        );
        break;

      case LevelFlags.FlowAlways:
        this.flow.visible = true;
        this.flow.flowInside.flowBar.scaleX = 1;
        break;
    }

    if (this.player.burningFlow) {
      this.flowCount++;
      if (this.flowCount == 1) {
        this.flow.flowReady.gotoAndPlay(31);
      }
      this.flow.flowInside.filters = new Array<any>(
        new lib.flash.filters.GlowFilter(39423, 1, 15, 15, 1.5)
      );
    } else {
      this.flowCount = this.flowCount - 3;
      this.bordering.filters = new Array<any>();
      this.flow.flowInside.filters = new Array<any>();
      if (this.player.flowPoints >= 100) {
        if (this.flow.flowReady.visible == false) {
          this.flow.flowReady.visible = true;
          Anim.colourMe(this.flow.flowInside, 16777215);
          this.flow.flowReady.gotoAndPlay(2);
          SoundBox.playSound("FlowReady");
        }
      } else if (this.flow.flowReady.visible) {
        this.flow.flowReady.visible = false;
        Anim.colourMe(this.flow.flowInside, 11184810);
      }
    }
    if (this.flowCount <= 0) {
      this.flowCount = 0;
      this.bordering.filters = new Array<any>();
    } else {
      this.bordering.filters = new Array<any>(
        new lib.flash.filters.GlowFilter(
          39423,
          Math.min(this.flowCount / 10, 1),
          0,
          Math.min(15, this.flowCount),
          Math.min(10, this.flowCount / 10)
        )
      );
    }
  }
}
