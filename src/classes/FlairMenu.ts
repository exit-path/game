import lib from "swf-lib";
import { Relay } from "./john/Relay";
import { ScrollEvent } from "./fl/events/ScrollEvent";
import { scrollBar } from "./scrollBar";
import { PlayerObject } from "./PlayerObject";
import { Ach } from "./Ach";

export class FlairMenu extends lib.flash.display.MovieClip {
  public declare achievements: Ach[];

  public declare holder: lib.flash.display.MovieClipT<{
    backToButton: lib.flash.display.SimpleButton;
    scrollBar_mc: scrollBar;
  }>;

  public declare playerObject: PlayerObject;

  public declare s0: lib.flash.display.MovieClip;

  public declare s1: lib.flash.display.MovieClip;

  public declare s10: lib.flash.display.MovieClip;

  public declare s11: lib.flash.display.MovieClip;

  public declare s12: lib.flash.display.MovieClip;

  public declare s13: lib.flash.display.MovieClip;

  public declare s14: lib.flash.display.MovieClip;

  public declare s15: lib.flash.display.MovieClip;

  public declare s16: lib.flash.display.MovieClip;

  public declare s17: lib.flash.display.MovieClip;

  public declare s18: lib.flash.display.MovieClip;

  public declare s19: lib.flash.display.MovieClip;

  public declare s2: lib.flash.display.MovieClip;

  public declare s20: lib.flash.display.MovieClip;

  public declare s21: lib.flash.display.MovieClip;

  public declare s22: lib.flash.display.MovieClip;

  public declare s23: lib.flash.display.MovieClip;

  public declare s24: lib.flash.display.MovieClip;

  public declare s25: lib.flash.display.MovieClip;

  public declare s26: lib.flash.display.MovieClip;

  public declare s27: lib.flash.display.MovieClip;

  public declare s28: lib.flash.display.MovieClip;

  public declare s29: lib.flash.display.MovieClip;

  public declare s3: lib.flash.display.MovieClip;

  public declare s30: lib.flash.display.MovieClip;

  public declare s31: lib.flash.display.MovieClip;

  public declare s32: lib.flash.display.MovieClip;

  public declare s33: lib.flash.display.MovieClip;

  public declare s34: lib.flash.display.MovieClip;

  public declare s35: lib.flash.display.MovieClip;

  public declare s36: lib.flash.display.MovieClip;

  public declare s37: lib.flash.display.MovieClip;

  public declare s38: lib.flash.display.MovieClip;

  public declare s39: lib.flash.display.MovieClip;

  public declare s4: lib.flash.display.MovieClip;

  public declare s40: lib.flash.display.MovieClip;

  public declare s41: lib.flash.display.MovieClip;

  public declare s42: lib.flash.display.MovieClip;

  public declare s43: lib.flash.display.MovieClip;

  public declare s44: lib.flash.display.MovieClip;

  public declare s45: lib.flash.display.MovieClip;

  public declare s46: lib.flash.display.MovieClip;

  public declare s47: lib.flash.display.MovieClip;

  public declare s5: lib.flash.display.MovieClip;

  public declare s6: lib.flash.display.MovieClip;

  public declare s7: lib.flash.display.MovieClip;

  public declare s8: lib.flash.display.MovieClip;

  public declare s9: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.achievements = new Array<any>();
  }

  public addListeners(): any {
    this.holder.backToButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons,
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
  }

  public buttons(e: lib.flash.events.MouseEvent): any {
    switch (e.currentTarget) {
      case this.holder.backToButton:
        this.dispatchEvent(new Relay(Relay.GOTO, "FlairMenu", "Back"));
    }
  }

  private handleScrollBarScroll(e: ScrollEvent): void {
    var scrollHeight: number =
      this.height - 50 - this.holder.scrollBar_mc.height;
    this.y = 0 + this.holder.scrollBar_mc.percent * -scrollHeight;
  }

  public init(playerOb: PlayerObject, achs: Ach[]): any {
    var ach: Ach = null;
    this.playerObject = playerOb;
    this.achievements = achs;
    this.addListeners();
    for (var i = 0; i < 48; i++) {
      ach = achs[i];
      this["s" + i].nam.text = ach.achName;
      this["s" + i].desc.text = ach.description;
      if (this.playerObject.achs[i]) {
        this["s" + i].lock.visible = false;
        if (i >= 24) {
          this["s" + i].headgear.handGear.gotoAndStop(i - 23);
          this["s" + i].headgear.head.visible = false;
          this["s" + i].headgear.head2.visible = false;
        } else {
          this["s" + i].headgear.head.gotoAndStop(i + 1);
          this["s" + i].headgear.handGear.visible = false;
        }
      } else {
        this["s" + i].headgear.visible = false;
      }
    }
    this.holder.scrollBar_mc.addEventListener(
      ScrollEvent.SCROLL,
      this.handleScrollBarScroll,
      false,
      0,
      true
    );
  }

  public kill(): any {
    this.holder.backToButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.buttons
    );
    this.removeEventListener(lib.flash.events.Event.ENTER_FRAME, this.ping);
  }

  public ping(e: lib.flash.events.Event = null): any {
    this.holder.y = 0 - this.y;
  }

  private updateScrollBar(): void {
    var scrollHeight: number =
      this.height - 50 - this.holder.scrollBar_mc.height;
    this.holder.scrollBar_mc.maxScrollPosition = scrollHeight;
    this.y = 0 + this.holder.scrollBar_mc.percent * -scrollHeight;
  }
}
