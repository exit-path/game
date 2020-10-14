import lib from "swf-lib";
import { Relay } from "./john/Relay";

export class MultiplayerWarning extends lib.flash.display.MovieClip {
  public declare noThankYouButton: lib.flash.display.SimpleButton;

  public declare okayButton: lib.flash.display.SimpleButton;

  public constructor() {
    super();
  }

  public init(): any {
    this.okayButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.okay
    );
    this.noThankYouButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.noThankYou
    );
  }

  public noThankYou(e: lib.flash.events.MouseEvent): any {
    this.okayButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.okay
    );
    this.noThankYouButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.noThankYou
    );
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  public okay(e: lib.flash.events.MouseEvent): any {
    this.okayButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.okay
    );
    this.noThankYouButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.noThankYou
    );
    this.dispatchEvent(new Relay(Relay.GOTO, "ExitPathLink"));
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
