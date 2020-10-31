import lib from "swf-lib";
import { ColorPicker } from "./fl/controls/ColorPicker";
import { ColorPickerEvent } from "./fl/events/ColorPickerEvent";
import { Relay } from "./john/Relay";
import { PlayerObject } from "./PlayerObject";
import { Runner } from "./Runner";

export class CharacterSelection extends lib.flash.display.MovieClip {
  public declare backToMenuButton: lib.flash.display.SimpleButton;

  public declare box0: lib.flash.display.MovieClip;

  public declare box1: lib.flash.display.MovieClip;

  public declare box10: lib.flash.display.MovieClip;

  public declare box11: lib.flash.display.MovieClip;

  public declare box12: lib.flash.display.MovieClip;

  public declare box13: lib.flash.display.MovieClip;

  public declare box14: lib.flash.display.MovieClip;

  public declare box15: lib.flash.display.MovieClip;

  public declare box16: lib.flash.display.MovieClip;

  public declare box17: lib.flash.display.MovieClip;

  public declare box18: lib.flash.display.MovieClip;

  public declare box19: lib.flash.display.MovieClip;

  public declare box2: lib.flash.display.MovieClip;

  public declare box20: lib.flash.display.MovieClip;

  public declare box21: lib.flash.display.MovieClip;

  public declare box22: lib.flash.display.MovieClip;

  public declare box23: lib.flash.display.MovieClip;

  public declare box3: lib.flash.display.MovieClip;

  public declare box4: lib.flash.display.MovieClip;

  public declare box5: lib.flash.display.MovieClip;

  public declare box6: lib.flash.display.MovieClip;

  public declare box7: lib.flash.display.MovieClip;

  public declare box8: lib.flash.display.MovieClip;

  public declare box9: lib.flash.display.MovieClip;

  public declare colour: number;

  public declare colour2: number;

  public declare item0: lib.flash.display.MovieClip;

  public declare item1: lib.flash.display.MovieClip;

  public declare item10: lib.flash.display.MovieClip;

  public declare item11: lib.flash.display.MovieClip;

  public declare item12: lib.flash.display.MovieClip;

  public declare item13: lib.flash.display.MovieClip;

  public declare item14: lib.flash.display.MovieClip;

  public declare item15: lib.flash.display.MovieClip;

  public declare item16: lib.flash.display.MovieClip;

  public declare item17: lib.flash.display.MovieClip;

  public declare item18: lib.flash.display.MovieClip;

  public declare item19: lib.flash.display.MovieClip;

  public declare item2: lib.flash.display.MovieClip;

  public declare item20: lib.flash.display.MovieClip;

  public declare item21: lib.flash.display.MovieClip;

  public declare item22: lib.flash.display.MovieClip;

  public declare item23: lib.flash.display.MovieClip;

  public declare item3: lib.flash.display.MovieClip;

  public declare item4: lib.flash.display.MovieClip;

  public declare item5: lib.flash.display.MovieClip;

  public declare item6: lib.flash.display.MovieClip;

  public declare item7: lib.flash.display.MovieClip;

  public declare item8: lib.flash.display.MovieClip;

  public declare item9: lib.flash.display.MovieClip;

  public declare pickerA: ColorPicker;

  public declare pickerB: ColorPicker;

  public declare playerObject: PlayerObject;

  public declare runnerBar: lib.flash.display.MovieClipT<{
    runner: Runner;
  }>;

  public declare tagOf: lib.flash.text.TextField;

  public constructor(playerObj: PlayerObject) {
    super();
    this.colour = 0;
    this.colour2 = 0;
    this.playerObject = playerObj;
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.ping,
      false,
      0,
      true
    );
    this.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.clicky,
      false,
      0,
      true
    );
    this.pickerA.addEventListener(ColorPickerEvent.ITEM_ROLL_OVER, this.roll);
    this.pickerB.addEventListener(ColorPickerEvent.ITEM_ROLL_OVER, this.roll);
    this.pickerA.addEventListener(ColorPickerEvent.CHANGE, this.roll);
    this.pickerB.addEventListener(ColorPickerEvent.CHANGE, this.roll);
    this.backToMenuButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.backButt,
      false,
      0,
      true
    );
    this.pickerA.selectedColor = this.playerObject.colour;
    this.pickerB.selectedColor = this.playerObject.colour2;
    this.runnerBar.runner.colour = this.playerObject.colour;
    this.runnerBar.runner.colour2 = this.playerObject.colour2;
    this.runnerBar.runner.headType = this.playerObject.headType;
    this.runnerBar.runner.handType = this.playerObject.handType;
    this.tagOf.text = this.playerObject.userName;
    for (var i: any = 0; i < 24; i++) {
      this["box" + i].head.gotoAndStop(i + 1);
      if (this.playerObject.achs[i]) {
        this["box" + i].lock.visible = false;
        this["box" + i].whiteOutline.visible = true;
      } else {
        this["box" + i].head.visible = false;
        this["box" + i].lock.visible = true;
        this["box" + i].whiteOutline.visible = false;
      }
    }
    for (i = 0; i < 24; i++) {
      this["item" + i].arm.handGear.gotoAndStop(i + 1);
      if (this.playerObject.achs[i + 24]) {
        this["item" + i].lock.visible = false;
        this["item" + i].whiteOutline.visible = true;
      } else {
        this["item" + i].arm.handGear.visible = false;
        this["item" + i].lock.visible = true;
        this["item" + i].whiteOutline.visible = false;
      }
    }
  }

  public backButt(e: lib.flash.events.MouseEvent = null): any {
    this.dispatchEvent(new Relay(Relay.GOTO, "SaveGame"));
    this.dispatchEvent(new Relay(Relay.GOTO, "CharacterSelection", "Back"));
  }

  public clicky(e: lib.flash.events.MouseEvent = null): any {
    for (var i: any = 0; i < 24; i++) {
      if (this["box" + i].whiteOutline.hitTestPoint(this.mouseX, this.mouseY)) {
        this.runnerBar.runner.headType = this.playerObject.headType = i + 1;
      }
    }
    for (i = 0; i < 24; i++) {
      if (
        this["item" + i].whiteOutline.hitTestPoint(this.mouseX, this.mouseY)
      ) {
        this.runnerBar.runner.handType = this.playerObject.handType = i + 1;
      }
    }
  }

  public kill(): any {
    this.removeEventListener(lib.flash.events.Event.ENTER_FRAME, this.ping);
    this.pickerA.removeEventListener(
      ColorPickerEvent.ITEM_ROLL_OVER,
      this.roll
    );
    this.pickerB.removeEventListener(
      ColorPickerEvent.ITEM_ROLL_OVER,
      this.roll
    );
    this.pickerA.removeEventListener(ColorPickerEvent.CHANGE, this.roll);
    this.pickerB.removeEventListener(ColorPickerEvent.CHANGE, this.roll);
    this.backToMenuButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.backButt
    );
  }

  public ping(e: lib.flash.events.Event = null): any {
    this.runnerBar.runner.setColours();
    this.playerObject.userName = this.tagOf.text;
  }

  public roll(e: ColorPickerEvent = null): any {
    const picker = e.currentTarget as ColorPicker;
    if (picker == this.pickerA) {
      this.runnerBar.runner.colour = picker.selectedColor;
      this.playerObject.colour = picker.selectedColor;
    } else {
      this.runnerBar.runner.colour2 = picker.selectedColor;
      this.playerObject.colour2 = picker.selectedColor;
    }
  }
}
