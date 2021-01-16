import lib from "swf-lib";
import { Relay } from "./john/Relay";
import { Anim } from "./john/Anim";

export class QuickPlayLobby extends lib.flash.display.MovieClip {
  public declare backToMenuButton: lib.flash.display.SimpleButton;

  public declare connectionMeter: lib.flash.display.MovieClipT<{
    matcher: lib.flash.display.MovieClip;
  }>;

  public declare gameReady: boolean;

  private declare numPlayers: number;

  public declare playerCountText: lib.flash.text.TextField;

  public declare startCounter: number;

  public declare step: number;

  private declare totalPlayers: number;

  public constructor() {
    super();
    this.numPlayers = 0;
    this.step = 0;
    this.totalPlayers = 1;
    this.gameReady = false;
    this.startCounter = 0;
  }

  public buttons(e: lib.flash.events.MouseEvent): any {
    switch (e.currentTarget) {
      case this.backToMenuButton:
        this.dispatchEvent(new Relay(Relay.GOTO, "QuickPlayLobby", "Back"));
    }
  }

  public init(): any {
    this.backToMenuButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.step = 0;
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.ping,
      false,
      0,
      true
    );
  }

  public kill(): any {
    this.backToMenuButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
  }

  public ping(e: lib.flash.events.Event): any {
    if (this.step == 0) {
      this.connectionMeter.matcher.width = Anim.ease(
        this.connectionMeter.matcher.width,
        0,
        0.3
      );
      this.playerCountText.text = "Connecting...";
    }
    if (this.step == 1) {
      this.connectionMeter.matcher.width = Anim.ease(
        this.connectionMeter.matcher.width,
        20,
        0.3
      );
      this.playerCountText.text = "Poking Server...";
    }
    if (this.step == 2) {
      this.connectionMeter.matcher.width = Anim.ease(
        this.connectionMeter.matcher.width,
        182,
        0.3
      );
      this.playerCountText.text = "Finding Room...";
    }
    if (this.step == 3) {
      this.connectionMeter.matcher.width = Anim.ease(
        this.connectionMeter.matcher.width,
        345 + (166 / this.totalPlayers) * this.numPlayers,
        0.3
      );
    }
    if (this.step == 4) {
      this.connectionMeter.matcher.width = Anim.ease(
        this.connectionMeter.matcher.width,
        511,
        0.3
      );
      this.gameReady = true;
    }
  }

  public updateUserCount(num: number, num2: number): any {
    this.playerCountText.text = num + "/" + num2 + " Players Found";
    this.numPlayers = num;
    this.totalPlayers = num2;
    if (num > 1) {
      this.gameReady = true;
      this.step = 4;
    }
  }
}
