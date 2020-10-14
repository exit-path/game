import lib from "swf-lib";
import { IFocusManagerComponent } from "../managers/IFocusManagerComponent";
import { StyleManager } from "../managers/StyleManager";
import { InvalidationType } from "./InvalidationType";
import { FocusManager } from "../managers/FocusManager";
import { IFocusManager } from "../managers/IFocusManager";
import { ComponentEvent } from "../events/ComponentEvent";

export class UIComponent extends lib.flash.display.Sprite {
  protected declare _enabled: boolean;

  private declare _focusEnabled: boolean;

  protected declare _height: number;

  protected declare _imeMode: string;

  protected declare _inspector: boolean;

  private declare _mouseFocusEnabled: boolean;

  protected declare _oldIMEMode: string;

  protected declare _width: number;

  protected declare _x: number;

  protected declare _y: number;

  protected declare callLaterMethods: lib.flash.utils.Dictionary;

  public declare static createAccessibilityImplementation: Function;

  private static defaultStyles: any = {
    focusRectSkin: "focusRectSkin",
    focusRectPadding: 2,
    textFormat: new lib.flash.text.TextFormat(
      "_sans",
      11,
      0,
      false,
      false,
      false,
      "",
      "",
      lib.flash.text.TextFormatAlign.LEFT,
      0,
      0,
      0,
      0
    ),
    disabledTextFormat: new lib.flash.text.TextFormat(
      "_sans",
      11,
      10066329,
      false,
      false,
      false,
      "",
      "",
      lib.flash.text.TextFormatAlign.LEFT,
      0,
      0,
      0,
      0
    ),
    defaultTextFormat: new lib.flash.text.TextFormat(
      "_sans",
      11,
      0,
      false,
      false,
      false,
      "",
      "",
      lib.flash.text.TextFormatAlign.LEFT,
      0,
      0,
      0,
      0
    ),
    defaultDisabledTextFormat: new lib.flash.text.TextFormat(
      "_sans",
      11,
      10066329,
      false,
      false,
      false,
      "",
      "",
      lib.flash.text.TextFormatAlign.LEFT,
      0,
      0,
      0,
      0
    ),
  };

  protected declare errorCaught: boolean;

  private static focusManagers: lib.flash.utils.Dictionary = new lib.flash.utils.Dictionary(
    false
  );

  public declare focusTarget: IFocusManagerComponent;

  public static inCallLaterPhase: boolean = false;

  protected declare instanceStyles: any;

  protected declare invalidateFlag: boolean;

  protected declare invalidHash: any;

  protected declare isFocused: boolean;

  protected declare isLivePreview: boolean;

  protected declare sharedStyles: any;

  protected declare startHeight: number;

  protected declare startWidth: number;

  private declare tempText: lib.flash.text.TextField;

  protected declare uiFocusRect: lib.flash.display.DisplayObject;

  public declare version: string;

  public constructor() {
    super();
    this._enabled = true;
    this._mouseFocusEnabled = true;
    this._focusEnabled = true;
    this.invalidateFlag = false;
    this._oldIMEMode = null;
    this._inspector = false;
    this.errorCaught = false;
    this.isLivePreview = false;
    this._imeMode = null;
    this.version = "3.0.0.16";
    this.isFocused = false;
    this.instanceStyles = {};
    this.sharedStyles = {};
    this.invalidHash = {};
    this.callLaterMethods = new lib.flash.utils.Dictionary();
    StyleManager.registerInstance(this);
    this.configUI();
    this.invalidate(InvalidationType.ALL);
    this.tabEnabled = lib.__internal.avm2.Runtime.isInterface(
      this,
      IFocusManagerComponent
    );
    this.focusRect = false;
    if (this.tabEnabled) {
      this.addEventListener(
        lib.flash.events.FocusEvent.FOCUS_IN,
        this.focusInHandler
      );
      this.addEventListener(
        lib.flash.events.FocusEvent.FOCUS_OUT,
        this.focusOutHandler
      );
      this.addEventListener(
        lib.flash.events.KeyboardEvent.KEY_DOWN,
        this.keyDownHandler
      );
      this.addEventListener(
        lib.flash.events.KeyboardEvent.KEY_UP,
        this.keyUpHandler
      );
    }
    this.initializeFocusManager();
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.hookAccessibility,
      false,
      0,
      true
    );
  }

  private addedHandler(param1: lib.flash.events.Event): void {
    this.removeEventListener("addedToStage", this.addedHandler);
    this.initializeFocusManager();
  }

  protected afterComponentParameters(): void {}

  protected beforeComponentParameters(): void {}

  protected callLater(param1: Function): void {
    if (UIComponent.inCallLaterPhase) {
      return;
    }
    this.callLaterMethods[param1] = true;
    if (this.stage != null) {
      this.stage.addEventListener(
        lib.flash.events.Event.RENDER,
        this.callLaterDispatcher,
        false,
        0,
        true
      );
      this.stage.invalidate();
    } else {
      this.addEventListener(
        lib.flash.events.Event.ADDED_TO_STAGE,
        this.callLaterDispatcher,
        false,
        0,
        true
      );
    }
  }

  private callLaterDispatcher(param1: lib.flash.events.Event): void {
    var _loc3_: any = null;
    if (param1.type == lib.flash.events.Event.ADDED_TO_STAGE) {
      this.removeEventListener(
        lib.flash.events.Event.ADDED_TO_STAGE,
        this.callLaterDispatcher
      );
      this.stage.addEventListener(
        lib.flash.events.Event.RENDER,
        this.callLaterDispatcher,
        false,
        0,
        true
      );
      this.stage.invalidate();
      return;
    }
    param1.target.removeEventListener(
      lib.flash.events.Event.RENDER,
      this.callLaterDispatcher
    );
    if (this.stage == null) {
      this.addEventListener(
        lib.flash.events.Event.ADDED_TO_STAGE,
        this.callLaterDispatcher,
        false,
        0,
        true
      );
      return;
    }
    UIComponent.inCallLaterPhase = true;
    var _loc2_: lib.flash.utils.Dictionary = this.callLaterMethods;
    for (_loc3_ in _loc2_) {
      _loc3_();
      delete _loc2_[_loc3_];
    }
    UIComponent.inCallLaterPhase = false;
  }

  protected checkLivePreview(): boolean {
    var className: string = null;
    if (this.parent == null) {
      return false;
    }
    try {
      className = lib.flash.utils.getQualifiedClassName(this.parent);
    } catch (e) {}
    return className == "fl.livepreview::LivePreviewParent";
  }

  public clearStyle(param1: string): void {
    this.setStyle(param1, null);
  }

  public get componentInspectorSetting(): boolean {
    return this._inspector;
  }

  public set componentInspectorSetting(param1: boolean) {
    this._inspector = param1;
    if (this._inspector) {
      this.beforeComponentParameters();
    } else {
      this.afterComponentParameters();
    }
  }

  protected configUI(): void {
    this.isLivePreview = this.checkLivePreview();
    var _loc1_: number = this.rotation;
    this.rotation = 0;
    var _loc2_: number = super.width;
    var _loc3_: number = super.height;
    1;
    super.scaleY = 1;
    super.scaleX = 1;
    this.setSize(_loc2_, _loc3_);
    this.move(super.x, super.y);
    this.rotation = _loc1_;
    this.startWidth = _loc2_;
    this.startHeight = _loc3_;
    if (this.numChildren > 0) {
      this.removeChildAt(0);
    }
  }

  protected copyStylesToChild(param1: UIComponent, param2: any): void {
    var _loc3_: any = null;
    for (_loc3_ in param2) {
      param1.setStyle(_loc3_, this.getStyleValue(param2[_loc3_]));
    }
  }

  protected createFocusManager(): void {
    if (UIComponent.focusManagers[this.stage] == null) {
      UIComponent.focusManagers[this.stage] = new FocusManager(this.stage);
    }
  }

  protected draw(): void {
    if (this.isInvalid(InvalidationType.SIZE, InvalidationType.STYLES)) {
      if (this.isFocused && this.focusManager.showFocusIndicator) {
        this.drawFocus(true);
      }
    }
    this.validate();
  }

  public drawFocus(param1: boolean): void {
    var _loc2_: number = NaN;
    this.isFocused = param1;
    if (this.uiFocusRect != null && this.contains(this.uiFocusRect)) {
      this.removeChild(this.uiFocusRect);
      this.uiFocusRect = null;
    }
    if (param1) {
      this.uiFocusRect = this.getDisplayObjectInstance(
        this.getStyleValue("focusRectSkin")
      ) as lib.flash.display.Sprite;
      if (this.uiFocusRect == null) {
        return;
      }
      _loc2_ = Number(this.getStyleValue("focusRectPadding"));
      this.uiFocusRect.x = -_loc2_;
      this.uiFocusRect.y = -_loc2_;
      this.uiFocusRect.width = this.width + _loc2_ * 2;
      this.uiFocusRect.height = this.height + _loc2_ * 2;
      this.addChildAt(this.uiFocusRect, 0);
    }
  }

  public drawNow(): void {
    this.draw();
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(param1: boolean) {
    if (param1 == this._enabled) {
      return;
    }
    this._enabled = param1;
    this.invalidate(InvalidationType.STATE);
  }

  public get focusEnabled(): boolean {
    return this._focusEnabled;
  }

  public set focusEnabled(param1: boolean) {
    this._focusEnabled = param1;
  }

  protected focusInHandler(param1: lib.flash.events.FocusEvent): void {
    var _loc2_: any = null;
    if (this.isOurFocus(param1.target as lib.flash.display.DisplayObject)) {
      _loc2_ = this.focusManager;
      if (_loc2_ && _loc2_.showFocusIndicator) {
        this.drawFocus(true);
        this.isFocused = true;
      }
    }
  }

  public get focusManager(): IFocusManager {
    var _loc1_: any = {};
    while (_loc1_) {
      if (UIComponent.focusManagers[_loc1_] != null) {
        return UIComponent.focusManagers[_loc1_] as IFocusManager;
      }
      _loc1_ = _loc1_.parent;
    }
    return null;
  }

  public set focusManager(param1: IFocusManager) {
    UIComponent.focusManagers["[object UIComponent]"] = param1;
  }

  protected focusOutHandler(param1: lib.flash.events.FocusEvent): void {
    if (this.isOurFocus(param1.target as lib.flash.display.DisplayObject)) {
      this.drawFocus(false);
      this.isFocused = false;
    }
  }

  protected getDisplayObjectInstance(
    param1: any
  ): lib.flash.display.DisplayObject {
    var skin: any = param1;
    var classDef: any = null;
    if (skin instanceof lib.__internal.avm2.Class) {
      return new skin() as lib.flash.display.DisplayObject;
    }
    if (skin instanceof lib.flash.display.DisplayObject) {
      (skin as lib.flash.display.DisplayObject).x = 0;
      (skin as lib.flash.display.DisplayObject).y = 0;
      return skin as lib.flash.display.DisplayObject;
    }
    try {
      classDef = lib.flash.utils.getDefinitionByName(skin.toString());
    } catch (e) {
      try {
        classDef = this.loaderInfo.applicationDomain.getDefinition(
          skin.toString()
        ) as object;
      } catch (e) {}
    }
    if (classDef == null) {
      return null;
    }
    return new classDef() as lib.flash.display.DisplayObject;
  }

  public getFocus(): lib.flash.display.InteractiveObject {
    if (this.stage) {
      return this.stage.focus;
    }
    return null;
  }

  protected getScaleX(): number {
    return super.scaleX;
  }

  protected getScaleY(): number {
    return super.scaleY;
  }

  public getStyle(param1: string): any {
    return this.instanceStyles[param1];
  }

  public static getStyleDefinition(): any {
    return UIComponent.defaultStyles;
  }

  protected getStyleValue(param1: string): any {
    return this.instanceStyles[param1] == null
      ? this.sharedStyles[param1]
      : this.instanceStyles[param1];
  }

  public get height(): number {
    return this._height;
  }

  public set height(param1: number) {
    if (this._height == param1) {
      return;
    }
    this.setSize(this.width, param1);
  }

  protected hookAccessibility(param1: lib.flash.events.Event): void {
    this.removeEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.hookAccessibility
    );
    this.initializeAccessibility();
  }

  protected initializeAccessibility(): void {
    if (UIComponent.createAccessibilityImplementation != null) {
      UIComponent.createAccessibilityImplementation(this);
    }
  }

  private initializeFocusManager(): void {
    if (this.stage == null) {
      this.addEventListener(
        lib.flash.events.Event.ADDED_TO_STAGE,
        this.addedHandler,
        false,
        0,
        true
      );
    } else {
      this.createFocusManager();
    }
  }

  public invalidate(param1: string = "all", param2: boolean = true): void {
    this.invalidHash[param1] = true;
    if (param2) {
      this.callLater(this.draw);
    }
  }

  protected isInvalid(param1: string, ...rest: any[]): boolean {
    if (this.invalidHash[param1] || this.invalidHash[InvalidationType.ALL]) {
      return true;
    }
    while (rest.length > 0) {
      if (this.invalidHash[rest.pop()]) {
        return true;
      }
    }
    return false;
  }

  protected isOurFocus(param1: lib.flash.display.DisplayObject): boolean {
    return param1 == this;
  }

  protected keyDownHandler(param1: lib.flash.events.KeyboardEvent): void {}

  protected keyUpHandler(param1: lib.flash.events.KeyboardEvent): void {}

  public static mergeStyles(...rest: any[]): any {
    var _loc5_: any = null;
    var _loc6_: any = null;
    var _loc2_: any = {};
    var _loc3_: number = rest.length;
    var _loc4_: number = 0;
    while (_loc4_ < _loc3_) {
      _loc5_ = rest[_loc4_];
      for (_loc6_ in _loc5_) {
        if (_loc2_[_loc6_] == null) {
          _loc2_[_loc6_] = rest[_loc4_][_loc6_];
        }
      }
      _loc4_++;
    }
    return _loc2_;
  }

  public get mouseFocusEnabled(): boolean {
    return this._mouseFocusEnabled;
  }

  public set mouseFocusEnabled(param1: boolean) {
    this._mouseFocusEnabled = param1;
  }

  public move(param1: number, param2: number): void {
    this._x = param1;
    this._y = param2;
    super.x = Math.round(param1);
    super.y = Math.round(param2);
    this.dispatchEvent(new ComponentEvent(ComponentEvent.MOVE));
  }

  public get scaleX(): number {
    return this.width / this.startWidth;
  }

  public set scaleX(param1: number) {
    this.setSize(this.startWidth * param1, this.height);
  }

  public get scaleY(): number {
    return this.height / this.startHeight;
  }

  public set scaleY(param1: number) {
    this.setSize(this.width, this.startHeight * param1);
  }

  public setFocus(): void {
    if (this.stage) {
      this.stage.focus = this;
    }
  }

  protected setIMEMode(param1: boolean): any {
    var enabled: boolean = param1;
    if (this._imeMode != null) {
      if (enabled) {
        lib.flash.system.IME.enabled = true;
        this._oldIMEMode = lib.flash.system.IME.conversionMode;
        try {
          if (
            !this.errorCaught &&
            lib.flash.system.IME.conversionMode !=
              lib.flash.system.IMEConversionMode.UNKNOWN
          ) {
            lib.flash.system.IME.conversionMode = this._imeMode;
          }
          this.errorCaught = false;
          return;
        } catch (e) {
          this.errorCaught = true;
          throw new Error("IME mode not supported: " + this._imeMode);
        }
      } else {
        if (
          lib.flash.system.IME.conversionMode !=
            lib.flash.system.IMEConversionMode.UNKNOWN &&
          this._oldIMEMode != lib.flash.system.IMEConversionMode.UNKNOWN
        ) {
          lib.flash.system.IME.conversionMode = this._oldIMEMode;
        }
        lib.flash.system.IME.enabled = false;
      }
    }
  }

  protected setScaleX(param1: number): void {
    super.scaleX = param1;
  }

  protected setScaleY(param1: number): void {
    super.scaleY = param1;
  }

  public setSharedStyle(param1: string, param2: any): void {
    if (
      this.sharedStyles[param1] === param2 &&
      !(param2 instanceof lib.flash.text.TextFormat)
    ) {
      return;
    }
    this.sharedStyles[param1] = param2;
    if (this.instanceStyles[param1] == null) {
      this.invalidate(InvalidationType.STYLES);
    }
  }

  public setSize(param1: number, param2: number): void {
    this._width = param1;
    this._height = param2;
    this.invalidate(InvalidationType.SIZE);
    this.dispatchEvent(new ComponentEvent(ComponentEvent.RESIZE, false));
  }

  public setStyle(param1: string, param2: any): void {
    if (
      this.instanceStyles[param1] === param2 &&
      !(param2 instanceof lib.flash.text.TextFormat)
    ) {
      return;
    }
    this.instanceStyles[param1] = param2;
    this.invalidate(InvalidationType.STYLES);
  }

  protected validate(): void {
    this.invalidHash = {};
  }

  public validateNow(): void {
    this.invalidate(InvalidationType.ALL, false);
    this.draw();
  }

  public get visible(): boolean {
    return super.visible;
  }

  public set visible(param1: boolean) {
    if (super.visible == param1) {
      return;
    }
    super.visible = param1;
    var _loc2_: string = !!param1 ? ComponentEvent.SHOW : ComponentEvent.HIDE;
    this.dispatchEvent(new ComponentEvent(_loc2_, true));
  }

  public get width(): number {
    return this._width;
  }

  public set width(param1: number) {
    if (this._width == param1) {
      return;
    }
    this.setSize(param1, this.height);
  }

  public get x(): number {
    return !!isNaN(this._x) ? Number(super.x) : Number(this._x);
  }

  public set x(param1: number) {
    this.move(param1, this._y);
  }

  public get y(): number {
    return !!isNaN(this._y) ? Number(super.y) : Number(this._y);
  }

  public set y(param1: number) {
    this.move(this._x, param1);
  }
}
