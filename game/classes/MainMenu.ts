import lib from "swf-lib";
import { MultiplayerWarning } from "./MultiplayerWarning";
import { Relay } from "./john/Relay";
import { SoundBox } from "./john/SoundBox";

export class MainMenu extends lib.flash.display.MovieClip {
  public declare agDomain: boolean;

  public declare armorGamesButton: lib.flash.display.SimpleButton;

  public declare facebookButton: lib.flash.display.SimpleButton;

  public declare fButton: lib.flash.display.SimpleButton;

  public declare gogogo: lib.flash.display.SimpleButton;

  public declare mButton: lib.flash.display.SimpleButton;

  public declare mpButton: lib.flash.display.SimpleButton;

  public declare mpGood: lib.flash.display.MovieClip;

  public declare muteButton: lib.flash.display.SimpleButton;

  public declare spButton: lib.flash.display.SimpleButton;

  public declare twitterButton: lib.flash.display.SimpleButton;

  public declare warning: MultiplayerWarning;

  public constructor(agDo: boolean = true) {
    super();
    this.agDomain = false;
    this.mpButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.mpButtonHandler,
      false,
      0,
      true
    );
    this.spButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.spButtonHandler,
      false,
      0,
      true
    );
    this.fButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.fButtonHandler,
      false,
      0,
      true
    );
    this.mButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.mButtonHandler,
      false,
      0,
      true
    );
    this.twitterButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.tButtonHandler,
      false,
      0,
      true
    );
    this.facebookButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.fbButtonHandler,
      false,
      0,
      true
    );
    this.armorGamesButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.agButtonHandler,
      false,
      0,
      true
    );
    this.gogogo.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.goHandler,
      false,
      0,
      true
    );
    this.muteButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.muteOut,
      false,
      0,
      true
    );
    this.agDomain = agDo;
  }

  public agButtonHandler(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "ArmorGames"));
  }

  public fbButtonHandler(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "Facebook"));
  }

  public fButtonHandler(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "MainMenu", "Flair"));
  }

  public goHandler(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "DeleteAllData"));
  }

  public kill(): any {
    this.mpButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.mpButtonHandler
    );
    this.spButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.spButtonHandler
    );
    this.fButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.fButtonHandler
    );
    this.mButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.mButtonHandler
    );
    this.twitterButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.tButtonHandler
    );
    this.facebookButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.fbButtonHandler
    );
    this.armorGamesButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.agButtonHandler
    );
    this.gogogo.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.goHandler
    );
    this.muteButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.muteOut
    );
    this.parent["killAGISaver"]();
  }

  public mButtonHandler(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "MainMenu", "CharacterEdit"));
  }

  public mpButtonHandler(e: lib.flash.events.MouseEvent = null): any {
    if (this.agDomain) {
      this.dispatchEvent(new Relay(Relay.GOTO, "MainMenu", "Multiplayer"));
    } else {
      this.warning = new MultiplayerWarning();
      this.addChild(this.warning);
      this.warning.init();
    }
  }

  public muteOut(e: lib.flash.events.MouseEvent = null): any {
    SoundBox.handleMute();
  }

  public spButtonHandler(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "MainMenu", "SinglePlayer"));
  }

  public tButtonHandler(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "Twitter"));
  }
}
