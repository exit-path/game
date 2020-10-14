import lib from "swf-lib";
import { UIComponent } from "../core/UIComponent";
import { ComponentEvent } from "../events/ComponentEvent";
import { InvalidationType } from "../core/InvalidationType";

export class BaseButton extends UIComponent {
  protected declare _autoRepeat: boolean;

  private declare _mouseStateLocked: boolean;

  protected declare _selected: boolean;

  protected declare background: lib.flash.display.DisplayObject;

  private static defaultStyles: any = {
    upSkin: "Button_upSkin",
    downSkin: "Button_downSkin",
    overSkin: "Button_overSkin",
    disabledSkin: "Button_disabledSkin",
    selectedDisabledSkin: "Button_selectedDisabledSkin",
    selectedUpSkin: "Button_selectedUpSkin",
    selectedDownSkin: "Button_selectedDownSkin",
    selectedOverSkin: "Button_selectedOverSkin",
    focusRectSkin: null,
    focusRectPadding: null,
    repeatDelay: 500,
    repeatInterval: 35,
  };

  protected declare mouseState: string;

  protected declare pressTimer: lib.flash.utils.Timer;

  private declare unlockedMouseState: string;

  public constructor() {
    super();
    this._autoRepeat = false;
    this._selected = false;
    this._mouseStateLocked = false;
    this.buttonMode = true;
    this.mouseChildren = false;
    this.useHandCursor = false;
    this.setupMouseEvents();
    this.setMouseState("up");
    this.pressTimer = new lib.flash.utils.Timer(1, 0);
    this.pressTimer.addEventListener(
      lib.flash.events.TimerEvent.TIMER,
      this.buttonDown,
      false,
      0,
      true
    );
  }

  public get autoRepeat(): boolean {
    return this._autoRepeat;
  }

  public set autoRepeat(param1: boolean) {
    this._autoRepeat = param1;
  }

  protected buttonDown(param1: lib.flash.events.TimerEvent): void {
    if (!this._autoRepeat) {
      this.endPress();
      return;
    }
    if (this.pressTimer.currentCount == 1) {
      this.pressTimer.delay = Number(this.getStyleValue("repeatInterval"));
    }
    this.dispatchEvent(new ComponentEvent(ComponentEvent.BUTTON_DOWN, true));
  }

  protected draw(): void {
    if (this.isInvalid(InvalidationType.STYLES, InvalidationType.STATE)) {
      this.drawBackground();
      this.invalidate(InvalidationType.SIZE, false);
    }
    if (this.isInvalid(InvalidationType.SIZE)) {
      this.drawLayout();
    }
    super.draw();
  }

  protected drawBackground(): void {
    var _loc1_: any = !!this.enabled ? this.mouseState : "disabled";
    if (this.selected) {
      _loc1_ =
        "selected" + _loc1_.substr(0, 1).toUpperCase() + _loc1_.substr(1);
    }
    _loc1_ = _loc1_ + "Skin";
    var _loc2_: lib.flash.display.DisplayObject = this.background;
    this.background = this.getDisplayObjectInstance(this.getStyleValue(_loc1_));
    this.addChildAt(this.background, 0);
    if (_loc2_ != null && _loc2_ != this.background) {
      this.removeChild(_loc2_);
    }
  }

  protected drawLayout(): void {
    this.background.width = this.width;
    this.background.height = this.height;
  }

  public get enabled(): boolean {
    return super.enabled;
  }

  public set enabled(param1: boolean) {
    super.enabled = param1;
    this.mouseEnabled = param1;
  }

  protected endPress(): void {
    this.pressTimer.reset();
  }

  public static getStyleDefinition(): any {
    return BaseButton.defaultStyles;
  }

  protected mouseEventHandler(param1: lib.flash.events.MouseEvent): void {
    if (param1.type == lib.flash.events.MouseEvent.MOUSE_DOWN) {
      this.setMouseState("down");
      this.startPress();
    } else if (
      param1.type == lib.flash.events.MouseEvent.ROLL_OVER ||
      param1.type == lib.flash.events.MouseEvent.MOUSE_UP
    ) {
      this.setMouseState("over");
      this.endPress();
    } else if (param1.type == lib.flash.events.MouseEvent.ROLL_OUT) {
      this.setMouseState("up");
      this.endPress();
    }
  }

  public set mouseStateLocked(param1: boolean) {
    this._mouseStateLocked = param1;
    if (param1 == false) {
      this.setMouseState(this.unlockedMouseState);
    } else {
      this.unlockedMouseState = this.mouseState;
    }
  }

  public get selected(): boolean {
    return this._selected;
  }

  public set selected(param1: boolean) {
    if (this._selected == param1) {
      return;
    }
    this._selected = param1;
    this.invalidate(InvalidationType.STATE);
  }

  public setMouseState(param1: string): void {
    if (this._mouseStateLocked) {
      this.unlockedMouseState = param1;
      return;
    }
    if (this.mouseState == param1) {
      return;
    }
    this.mouseState = param1;
    this.invalidate(InvalidationType.STATE);
  }

  protected setupMouseEvents(): void {
    this.addEventListener(
      lib.flash.events.MouseEvent.ROLL_OVER,
      this.mouseEventHandler,
      false,
      0,
      true
    );
    this.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_DOWN,
      this.mouseEventHandler,
      false,
      0,
      true
    );
    this.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_UP,
      this.mouseEventHandler,
      false,
      0,
      true
    );
    this.addEventListener(
      lib.flash.events.MouseEvent.ROLL_OUT,
      this.mouseEventHandler,
      false,
      0,
      true
    );
  }

  protected startPress(): void {
    if (this._autoRepeat) {
      this.pressTimer.delay = Number(this.getStyleValue("repeatDelay"));
      this.pressTimer.start();
    }
    this.dispatchEvent(new ComponentEvent(ComponentEvent.BUTTON_DOWN, true));
  }
}
