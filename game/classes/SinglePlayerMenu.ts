import lib from "swf-lib";
import { ExternalEvent } from "./ExternalEvent";
import { Relay } from "./john/Relay";
import { StopWatch } from "./john/StopWatch";
import { PlayerObject } from "./PlayerObject";
import { Runner } from "./Runner";

export class SinglePlayerMenu extends lib.flash.display.MovieClip {
  public declare backToButton: lib.flash.display.SimpleButton;

  public declare bestTime: lib.flash.text.TextField;

  public declare currentProgress: lib.flash.text.TextField;

  public declare customizeButton: lib.flash.display.SimpleButton;

  public declare deleteSure: lib.flash.display.MovieClipT<{
    noButton: lib.flash.display.SimpleButton;
    yesButton: lib.flash.display.SimpleButton;
  }>;

  public declare eraseButt: lib.flash.display.SimpleButton;

  public declare nameDisp: lib.flash.text.TextField;

  public declare playButt: lib.flash.display.SimpleButton;

  public declare playerObject: PlayerObject;

  public declare runnerBar: lib.flash.display.MovieClipT<{
    runner: Runner;
  }>;

  public declare signsCollected: lib.flash.text.TextField;

  public declare viewButt: lib.flash.display.SimpleButton;

  public constructor() {
    super();
  }

  public addListeners(): any {
    this.playButt.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.viewButt.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.eraseButt.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.backToButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.customizeButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.deleteSure.yesButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
    this.deleteSure.noButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
      false,
      0,
      true
    );
  }

  public buttons(e: lib.flash.events.MouseEvent): any {
    switch (e.currentTarget) {
      case this.playButt:
        this.dispatchEvent(
          new Relay(Relay.GOTO, "SinglePlayerMenu", "StartGame")
        );
        break;
      case this.viewButt:
        this.dispatchEvent(
          new Relay(Relay.GOTO, "SinglePlayerMenu", "ViewHighscores")
        );
        break;
      case this.eraseButt:
        this.deleteSure.visible = true;
        break;
      case this.backToButton:
        this.dispatchEvent(
          new Relay(Relay.GOTO, "SinglePlayerMenu", "BackButton")
        );
        break;
      case this.customizeButton:
        this.dispatchEvent(
          new Relay(Relay.GOTO, "SinglePlayerMenu", "CharacterSelection")
        );
        break;
      case this.deleteSure.yesButton:
        this.dispatchEvent(new Relay(Relay.GOTO, "SinglePlayerMenu", "Delete"));
        break;
      case this.deleteSure.noButton:
        this.deleteSure.visible = false;
    }
  }

  public init(playerOb: PlayerObject): any {
    this.playerObject = playerOb;
    this.addListeners();
    this.nameDisp.text = "Welcome, " + this.playerObject.userName + "!";
    if (this.playerObject.bestTime <= 9999999) {
      this.bestTime.text = StopWatch.translateTime(this.playerObject.bestTime);
    } else {
      this.bestTime.text = "No Run";
    }
    if (this.playerObject.gameLevel == 0) {
      this.currentProgress.text = "Not Started";
    } else {
      this.currentProgress.text = "Level " + (1 + this.playerObject.gameLevel);
    }
    var totSigns: any = 0;
    for (var i: any = 0; i < this.playerObject.signs.length; i++) {
      if (this.playerObject.signs[i] == true) {
        totSigns++;
      }
    }
    this.signsCollected.text = totSigns + "/30";
    this.deleteSure.visible = false;
    this.runnerBar.runner.gotoAndStop(2);
    this.runnerBar.runner.colour = this.playerObject.colour;
    this.runnerBar.runner.colour2 = this.playerObject.colour2;
    this.runnerBar.runner.headType = this.playerObject.headType;
    this.runnerBar.runner.handType = this.playerObject.handType;
    this.runnerBar.runner.fuel();

    this.dispatchEvent(
      new ExternalEvent({
        type: "sp-menu-start",
      })
    );
  }

  public kill(): any {
    this.playButt.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.viewButt.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.eraseButt.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.backToButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.customizeButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.deleteSure.yesButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.deleteSure.noButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );

    this.dispatchEvent(
      new ExternalEvent({
        type: "sp-menu-end",
      })
    );
  }
}
