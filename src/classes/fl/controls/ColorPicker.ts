import lib from "swf-lib";
import { UIComponent } from "../core/UIComponent";
import { IFocusManagerComponent } from "../managers/IFocusManagerComponent";
import { BaseButton } from "./BaseButton";
import { IFocusManager } from "../managers/IFocusManager";
import { InvalidationType } from "../core/InvalidationType";
import { ColorPickerEvent } from "../events/ColorPickerEvent";

export class ColorPicker extends UIComponent implements IFocusManagerComponent {
  static readonly [IFocusManagerComponent.__IMPL] = true;
  protected declare _editable: boolean;

  protected declare _selectedColor: number;

  protected declare _showTextField: boolean;

  protected declare colorHash: any;

  protected declare colorWell: lib.flash.display.DisplayObject;

  protected declare currColIndex: number;

  protected declare currRowIndex: number;

  protected declare customColors: any[];

  public declare static defaultColors: any[];

  private static defaultStyles: any = {
    upSkin: "ColorPicker_upSkin",
    disabledSkin: "ColorPicker_disabledSkin",
    overSkin: "ColorPicker_overSkin",
    downSkin: "ColorPicker_downSkin",
    colorWell: "ColorPicker_colorWell",
    swatchSkin: "ColorPicker_swatchSkin",
    swatchSelectedSkin: "ColorPicker_swatchSelectedSkin",
    swatchWidth: 10,
    swatchHeight: 10,
    columnCount: 18,
    swatchPadding: 1,
    textFieldSkin: "ColorPicker_textFieldSkin",
    textFieldWidth: null,
    textFieldHeight: null,
    textPadding: 3,
    background: "ColorPicker_backgroundSkin",
    backgroundPadding: 5,
    textFormat: null,
    focusRectSkin: null,
    focusRectPadding: null,
    embedFonts: false,
  };

  protected declare doOpen: boolean;

  protected declare isOpen: boolean;

  protected declare palette: lib.flash.display.Sprite;

  protected declare paletteBG: lib.flash.display.DisplayObject;

  protected static readonly POPUP_BUTTON_STYLES: any = {
    disabledSkin: "disabledSkin",
    downSkin: "downSkin",
    overSkin: "overSkin",
    upSkin: "upSkin",
  };

  protected declare rollOverColor: number;

  protected declare selectedSwatch: lib.flash.display.Sprite;

  protected static readonly SWATCH_STYLES: any = {
    disabledSkin: "swatchSkin",
    downSkin: "swatchSkin",
    overSkin: "swatchSkin",
    upSkin: "swatchSkin",
  };

  protected declare swatchButton: BaseButton;

  protected declare swatches: lib.flash.display.Sprite;

  protected declare swatchMap: any[];

  protected declare swatchSelectedSkin: lib.flash.display.DisplayObject;

  public declare textField: lib.flash.text.TextField;

  protected declare textFieldBG: lib.flash.display.DisplayObject;

  public constructor() {
    super();
    this.isOpen = false;
    this._editable = true;
    this._showTextField = true;
    this.rollOverColor = -1;
    this.doOpen = false;
  }

  private addCloseListener(param1: lib.flash.events.Event): any {
    this.removeEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.addCloseListener
    );
    if (!this.isOpen) {
      return;
    }
    this.addStageListener();
  }

  protected addStageListener(param1: lib.flash.events.Event = null): void {
    this.stage.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_DOWN,
      this.onStageClick,
      false,
      0,
      true
    );
  }

  protected cleanUpSelected(): void {
    if (
      this.swatchSelectedSkin &&
      this.palette.contains(this.swatchSelectedSkin)
    ) {
      this.palette.removeChild(this.swatchSelectedSkin);
    }
  }

  public close(): void {
    if (this.isOpen) {
      this.stage.removeChild(this.palette);
      this.isOpen = false;
      this.dispatchEvent(
        new lib.flash.events.Event(lib.flash.events.Event.CLOSE)
      );
    }
    var _loc1_: IFocusManager = this.focusManager;
    if (_loc1_) {
      _loc1_.defaultButtonEnabled = true;
    }
    this.removeStageListener();
    this.cleanUpSelected();
  }

  public get colors(): any[] {
    return this.customColors != null
      ? this.customColors
      : ColorPicker.defaultColors;
  }

  public set colors(param1: any[]) {
    this.customColors = param1;
    this.invalidate(InvalidationType.DATA);
  }

  protected colorToString(param1: number): string {
    var _loc2_: string = param1.toString(16);
    while (_loc2_.length < 6) {
      _loc2_ = "0" + _loc2_;
    }
    return _loc2_;
  }

  protected configUI(): void {
    var _loc1_: number = 0;
    super.configUI();
    this.tabChildren = false;
    if (ColorPicker.defaultColors == null) {
      ColorPicker.defaultColors = [];
      _loc1_ = 0;
      while (_loc1_ < 216) {
        ColorPicker.defaultColors.push(
          (((((_loc1_ / 6) % 3 << 0) + ((_loc1_ / 108) << 0) * 3) * 51) << 16) |
            (((_loc1_ % 6) * 51) << 8) |
            ((((_loc1_ / 18) << 0) % 6) * 51)
        );
        _loc1_++;
      }
    }
    this.colorHash = {};
    this.swatchMap = [];
    this.textField = new lib.flash.text.TextField();
    this.textField.tabEnabled = false;
    this.swatchButton = new BaseButton();
    this.swatchButton.focusEnabled = false;
    this.swatchButton.useHandCursor = false;
    this.swatchButton.autoRepeat = false;
    this.swatchButton.setSize(25, 25);
    this.swatchButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.onPopupButtonClick,
      false,
      0,
      true
    );
    this.addChild(this.swatchButton);
    this.palette = new lib.flash.display.Sprite();
    this.palette.tabChildren = false;
    this.palette.cacheAsBitmap = true;
  }

  protected createSwatch(param1: number): lib.flash.display.Sprite {
    var _loc2_: lib.flash.display.Sprite = new lib.flash.display.Sprite();
    var _loc3_: BaseButton = new BaseButton();
    _loc3_.focusEnabled = false;
    var _loc4_: number = this.getStyleValue("swatchWidth") as number;
    var _loc5_: number = this.getStyleValue("swatchHeight") as number;
    _loc3_.setSize(_loc4_, _loc5_);
    _loc3_.transform.colorTransform = new lib.flash.geom.ColorTransform(
      0,
      0,
      0,
      1,
      param1 >> 16,
      (param1 >> 8) & 255,
      param1 & 255,
      0
    );
    this.copyStylesToChild(_loc3_, ColorPicker.SWATCH_STYLES);
    _loc3_.mouseEnabled = false;
    _loc3_.drawNow();
    _loc3_.name = "color";
    _loc2_.addChild(_loc3_);
    var _loc6_: number = this.getStyleValue("swatchPadding") as number;
    var _loc7_: lib.flash.display.Graphics = _loc2_.graphics;
    _loc7_.beginFill(0);
    _loc7_.drawRect(-_loc6_, -_loc6_, _loc4_ + _loc6_ * 2, _loc5_ + _loc6_ * 2);
    _loc7_.endFill();
    _loc2_.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.onSwatchClick,
      false,
      0,
      true
    );
    _loc2_.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_OVER,
      this.onSwatchOver,
      false,
      0,
      true
    );
    _loc2_.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_OUT,
      this.onSwatchOut,
      false,
      0,
      true
    );
    return _loc2_;
  }

  protected draw(): void {
    if (this.isInvalid(InvalidationType.STYLES, InvalidationType.DATA)) {
      this.setStyles();
      this.drawPalette();
      this.setEmbedFonts();
      this.invalidate(InvalidationType.DATA, false);
      this.invalidate(InvalidationType.STYLES, false);
    }
    if (this.isInvalid(InvalidationType.DATA)) {
      this.drawSwatchHighlight();
      this.setColorDisplay();
    }
    if (this.isInvalid(InvalidationType.STATE)) {
      this.setTextEditable();
      if (this.doOpen) {
        this.doOpen = false;
        this.showPalette();
      }
      this.colorWell.visible = this.enabled;
    }
    if (this.isInvalid(InvalidationType.SIZE, InvalidationType.STYLES)) {
      this.swatchButton.setSize(this.width, this.height);
      this.swatchButton.drawNow();
      this.colorWell.width = this.width;
      this.colorWell.height = this.height;
    }
    super.draw();
  }

  protected drawBG(): void {
    var _loc1_: any = this.getStyleValue("background");
    if (_loc1_ != null) {
      this.paletteBG = this.getDisplayObjectInstance(
        _loc1_
      ) as lib.flash.display.Sprite;
    }
    if (this.paletteBG == null) {
      return;
    }
    var _loc2_: number = Number(this.getStyleValue("backgroundPadding"));
    this.paletteBG.width =
      Math.max(
        !!this.showTextField ? Number(this.textFieldBG.width) : Number(0),
        this.swatches.width
      ) +
      _loc2_ * 2;
    this.paletteBG.height = this.swatches.y + this.swatches.height + _loc2_;
    this.palette.addChildAt(this.paletteBG, 0);
  }

  protected drawPalette(): void {
    if (this.isOpen) {
      this.stage.removeChild(this.palette);
    }
    this.palette = new lib.flash.display.Sprite();
    this.drawTextField();
    this.drawSwatches();
    this.drawBG();
  }

  protected drawSwatches(): void {
    var _loc10_: any = null;
    var _loc1_: number = this.getStyleValue("backgroundPadding") as number;
    var _loc2_: number = !!this.showTextField
      ? Number(this.textFieldBG.y + this.textFieldBG.height + _loc1_)
      : Number(_loc1_);
    this.swatches = new lib.flash.display.Sprite();
    this.palette.addChild(this.swatches);
    this.swatches.x = _loc1_;
    this.swatches.y = _loc2_;
    var _loc3_: number = this.getStyleValue("columnCount") as number;
    var _loc4_: number = this.getStyleValue("swatchPadding") as number;
    var _loc5_: number = this.getStyleValue("swatchWidth") as number;
    var _loc6_: number = this.getStyleValue("swatchHeight") as number;
    this.colorHash = {};
    this.swatchMap = [];
    var _loc7_: number = Math.min(1024, this.colors.length);
    var _loc8_: number = -1;
    var _loc9_: number = 0;
    while (_loc9_ < _loc7_) {
      _loc10_ = this.createSwatch(this.colors[_loc9_]);
      _loc10_.x = (_loc5_ + _loc4_) * (_loc9_ % _loc3_);
      if (_loc10_.x == 0) {
        this.swatchMap.push([_loc10_]);
        _loc8_++;
      } else {
        this.swatchMap[_loc8_].push(_loc10_);
      }
      this.colorHash[this.colors[_loc9_]] = {
        swatch: _loc10_,
        row: _loc8_,
        col: this.swatchMap[_loc8_].length - 1,
      };
      _loc10_.y = Math.floor(_loc9_ / _loc3_) * (_loc6_ + _loc4_);
      this.swatches.addChild(_loc10_);
      _loc9_++;
    }
  }

  protected drawSwatchHighlight(): void {
    this.cleanUpSelected();
    var _loc1_: any = this.getStyleValue("swatchSelectedSkin");
    var _loc2_: number = this.getStyleValue("swatchPadding") as number;
    if (_loc1_ != null) {
      this.swatchSelectedSkin = this.getDisplayObjectInstance(_loc1_);
      this.swatchSelectedSkin.x = 0;
      this.swatchSelectedSkin.y = 0;
      this.swatchSelectedSkin.width =
        (this.getStyleValue("swatchWidth") as number) + 2;
      this.swatchSelectedSkin.height =
        (this.getStyleValue("swatchHeight") as number) + 2;
    }
  }

  protected drawTextField(): void {
    if (!this.showTextField) {
      return;
    }
    var _loc1_: number = this.getStyleValue("backgroundPadding") as number;
    var _loc2_: number = this.getStyleValue("textPadding") as number;
    this.textFieldBG = this.getDisplayObjectInstance(
      this.getStyleValue("textFieldSkin")
    );
    if (this.textFieldBG != null) {
      this.palette.addChild(this.textFieldBG);
      this.textFieldBG.x = this.textFieldBG.y = _loc1_;
    }
    var _loc3_: any = UIComponent.getStyleDefinition();
    var _loc4_: lib.flash.text.TextFormat = !!this.enabled
      ? (_loc3_.defaultTextFormat as lib.flash.text.TextFormat)
      : (_loc3_.defaultDisabledTextFormat as lib.flash.text.TextFormat);
    this.textField.setTextFormat(_loc4_);
    var _loc5_: lib.flash.text.TextFormat = this.getStyleValue(
      "textFormat"
    ) as lib.flash.text.TextFormat;
    if (_loc5_ != null) {
      this.textField.setTextFormat(_loc5_);
    } else {
      _loc5_ = _loc4_;
    }
    this.textField.defaultTextFormat = _loc5_;
    this.setEmbedFonts();
    this.textField.restrict = "A-Fa-f0-9#";
    this.textField.maxChars = 6;
    this.palette.addChild(this.textField);
    this.textField.text = " #888888 ";
    this.textField.height = this.textField.textHeight + 3;
    this.textField.width = this.textField.textWidth + 3;
    this.textField.text = "";
    this.textField.x = this.textField.y = _loc1_ + _loc2_;
    this.textFieldBG.width = this.textField.width + _loc2_ * 2;
    this.textFieldBG.height = this.textField.height + _loc2_ * 2;
    this.setTextEditable();
  }

  public get editable(): boolean {
    return this._editable;
  }

  public set editable(param1: boolean) {
    this._editable = param1;
    this.invalidate(InvalidationType.STATE);
  }

  public get enabled(): boolean {
    return super.enabled;
  }

  public set enabled(param1: boolean) {
    super.enabled = param1;
    if (!param1) {
      this.close();
    }
    this.swatchButton.enabled = param1;
  }

  protected findSwatch(param1: number): lib.flash.display.Sprite {
    if (!this.swatchMap.length) {
      return null;
    }
    var _loc2_: any = this.colorHash[param1];
    if (_loc2_ != null) {
      return _loc2_.swatch;
    }
    return null;
  }

  protected focusInHandler(param1: lib.flash.events.FocusEvent): void {
    super.focusInHandler(param1);
    this.setIMEMode(true);
  }

  protected focusOutHandler(param1: lib.flash.events.FocusEvent): void {
    if (param1.relatedObject == this.textField) {
      this.setFocus();
      return;
    }
    if (this.isOpen) {
      this.close();
    }
    super.focusOutHandler(param1);
    this.setIMEMode(false);
  }

  public static getStyleDefinition(): any {
    return ColorPicker.defaultStyles;
  }

  public get hexValue(): string {
    if (this.colorWell == null) {
      return this.colorToString(0);
    }
    return this.colorToString(this.colorWell.transform.colorTransform.color);
  }

  public get imeMode(): string {
    return this._imeMode;
  }

  public set imeMode(param1: string) {
    this._imeMode = param1;
  }

  protected isOurFocus(param1: lib.flash.display.DisplayObject): boolean {
    return param1 == this.textField || super.isOurFocus(param1);
  }

  protected keyDownHandler(param1: lib.flash.events.KeyboardEvent): void {
    var _loc3_: any = null;
    switch (param1.keyCode) {
      case lib.flash.ui.Keyboard.SHIFT:
      case lib.flash.ui.Keyboard.CONTROL:
        return;
      default:
        if (param1.ctrlKey) {
          switch (param1.keyCode) {
            case lib.flash.ui.Keyboard.DOWN:
              this.open();
              break;
            case lib.flash.ui.Keyboard.UP:
              this.close();
          }
          return;
        }
        if (!this.isOpen) {
          switch (param1.keyCode) {
            case lib.flash.ui.Keyboard.UP:
            case lib.flash.ui.Keyboard.DOWN:
            case lib.flash.ui.Keyboard.LEFT:
            case lib.flash.ui.Keyboard.RIGHT:
            case lib.flash.ui.Keyboard.SPACE:
              this.open();
              return;
          }
        }
        this.textField.maxChars =
          param1.keyCode == "#".charCodeAt(0) ||
          this.textField.text.indexOf("#") > -1
            ? 7
            : 6;
        switch (param1.keyCode) {
          case lib.flash.ui.Keyboard.TAB:
            _loc3_ = this.findSwatch(this._selectedColor);
            this.setSwatchHighlight(_loc3_);
            return;
          case lib.flash.ui.Keyboard.HOME:
            this.currColIndex = this.currRowIndex = 0;
            break;
          case lib.flash.ui.Keyboard.END:
            this.currColIndex =
              this.swatchMap[this.swatchMap.length - 1].length - 1;
            this.currRowIndex = this.swatchMap.length - 1;
            break;
          case lib.flash.ui.Keyboard.PAGE_DOWN:
            this.currRowIndex = this.swatchMap.length - 1;
            break;
          case lib.flash.ui.Keyboard.PAGE_UP:
            this.currRowIndex = 0;
            break;
          case lib.flash.ui.Keyboard.ESCAPE:
            if (this.isOpen) {
              this.selectedColor = this._selectedColor;
            }
            this.close();
            return;
          case lib.flash.ui.Keyboard.ENTER:
            return;
          case lib.flash.ui.Keyboard.UP:
            this.currRowIndex = Math.max(-1, this.currRowIndex - 1);
            if (this.currRowIndex == -1) {
              this.currRowIndex = this.swatchMap.length - 1;
              break;
            }
            break;
          case lib.flash.ui.Keyboard.DOWN:
            this.currRowIndex = Math.min(
              this.swatchMap.length,
              this.currRowIndex + 1
            );
            if (this.currRowIndex == this.swatchMap.length) {
              this.currRowIndex = 0;
              break;
            }
            break;
          case lib.flash.ui.Keyboard.RIGHT:
            this.currColIndex = Math.min(
              this.swatchMap[this.currRowIndex].length,
              this.currColIndex + 1
            );
            if (this.currColIndex == this.swatchMap[this.currRowIndex].length) {
              this.currColIndex = 0;
              this.currRowIndex = Math.min(
                this.swatchMap.length,
                this.currRowIndex + 1
              );
              if (this.currRowIndex == this.swatchMap.length) {
                this.currRowIndex = 0;
                break;
              }
              break;
            }
            break;
          case lib.flash.ui.Keyboard.LEFT:
            this.currColIndex = Math.max(-1, this.currColIndex - 1);
            if (this.currColIndex == -1) {
              this.currColIndex = this.swatchMap[this.currRowIndex].length - 1;
              this.currRowIndex = Math.max(-1, this.currRowIndex - 1);
              if (this.currRowIndex == -1) {
                this.currRowIndex = this.swatchMap.length - 1;
                break;
              }
              break;
            }
            break;
          default:
            return;
        }
        var _loc2_: lib.flash.geom.ColorTransform = this.swatchMap[
          this.currRowIndex
        ][this.currColIndex].getChildByName("color").transform.colorTransform;
        this.rollOverColor = _loc2_.color;
        this.setColorWellColor(_loc2_);
        this.setSwatchHighlight(
          this.swatchMap[this.currRowIndex][this.currColIndex]
        );
        this.setColorText(_loc2_.color);
        return;
    }
  }

  protected keyUpHandler(param1: lib.flash.events.KeyboardEvent): void {
    var _loc2_: any = 0;
    var _loc4_: any = null;
    var _loc5_: any = null;
    if (!this.isOpen) {
      return;
    }
    var _loc3_: lib.flash.geom.ColorTransform = new lib.flash.geom.ColorTransform();
    if (this.editable && this.showTextField) {
      _loc4_ = this.textField.text;
      if (_loc4_.indexOf("#") > -1) {
        _loc4_ = _loc4_.replace(/^\s+|\s+$/g, "");
        _loc4_ = _loc4_.replace(/#/g, "");
      }
      _loc2_ = lib.__internal.avm2.Runtime.uint(parseInt(_loc4_, 16));
      _loc5_ = this.findSwatch(_loc2_);
      this.setSwatchHighlight(_loc5_);
      _loc3_.color = _loc2_;
      this.setColorWellColor(_loc3_);
    } else {
      _loc2_ = lib.__internal.avm2.Runtime.uint(this.rollOverColor);
      _loc3_.color = _loc2_;
    }
    if (param1.keyCode != lib.flash.ui.Keyboard.ENTER) {
      return;
    }
    this.dispatchEvent(new ColorPickerEvent(ColorPickerEvent.ENTER, _loc2_));
    this._selectedColor = this.rollOverColor;
    this.setColorText(_loc3_.color);
    this.rollOverColor = _loc3_.color;
    this.dispatchEvent(
      new ColorPickerEvent(ColorPickerEvent.CHANGE, this.selectedColor)
    );
    this.close();
  }

  protected onPopupButtonClick(param1: lib.flash.events.MouseEvent): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  protected onStageClick(param1: lib.flash.events.MouseEvent): void {
    if (
      !this.contains(param1.target as lib.flash.display.DisplayObject) &&
      !this.palette.contains(param1.target as lib.flash.display.DisplayObject)
    ) {
      this.selectedColor = this._selectedColor;
      this.close();
    }
  }

  protected onSwatchClick(param1: lib.flash.events.MouseEvent): void {
    var _loc2_: lib.flash.geom.ColorTransform = param1.target.getChildByName(
      "color"
    ).transform.colorTransform;
    this._selectedColor = _loc2_.color;
    this.dispatchEvent(
      new ColorPickerEvent(ColorPickerEvent.CHANGE, this.selectedColor)
    );
    this.close();
  }

  protected onSwatchOut(param1: lib.flash.events.MouseEvent): void {
    var _loc2_: lib.flash.geom.ColorTransform =
      param1.target.transform.colorTransform;
    this.dispatchEvent(
      new ColorPickerEvent(ColorPickerEvent.ITEM_ROLL_OUT, _loc2_.color)
    );
  }

  protected onSwatchOver(param1: lib.flash.events.MouseEvent): void {
    var _loc2_: BaseButton = param1.target.getChildByName(
      "color"
    ) as BaseButton;
    var _loc3_: lib.flash.geom.ColorTransform = _loc2_.transform.colorTransform;
    this.setColorWellColor(_loc3_);
    this.setSwatchHighlight(param1.target as lib.flash.display.Sprite);
    this.setColorText(_loc3_.color);
    this.dispatchEvent(
      new ColorPickerEvent(ColorPickerEvent.ITEM_ROLL_OVER, _loc3_.color)
    );
  }

  public open(): void {
    if (!this._enabled) {
      return;
    }
    this.doOpen = true;
    var _loc1_: IFocusManager = this.focusManager;
    if (_loc1_) {
      _loc1_.defaultButtonEnabled = false;
    }
    this.invalidate(InvalidationType.STATE);
  }

  protected positionPalette(): void {
    var _loc1_: lib.flash.geom.Point = this.swatchButton.localToGlobal(
      new lib.flash.geom.Point(0, 0)
    );
    var _loc2_: number = this.getStyleValue("backgroundPadding") as number;
    if (_loc1_.x + this.palette.width > this.stage.stageWidth) {
      this.palette.x = (_loc1_.x - this.palette.width) << 0;
    } else {
      this.palette.x = (_loc1_.x + this.swatchButton.width + _loc2_) << 0;
    }
    this.palette.y =
      Math.max(
        0,
        Math.min(_loc1_.y, this.stage.stageHeight - this.palette.height)
      ) << 0;
  }

  protected positionTextField(): void {
    if (!this.showTextField) {
      return;
    }
    var _loc1_: number = this.getStyleValue("backgroundPadding") as number;
    var _loc2_: number = this.getStyleValue("textPadding") as number;
    this.textFieldBG.x = this.paletteBG.x + _loc1_;
    this.textFieldBG.y = this.paletteBG.y + _loc1_;
    this.textField.x = this.textFieldBG.x + _loc2_;
    this.textField.y = this.textFieldBG.y + _loc2_;
  }

  protected removeStageListener(param1: lib.flash.events.Event = null): void {
    this.stage.removeEventListener(
      lib.flash.events.MouseEvent.MOUSE_DOWN,
      this.onStageClick,
      false
    );
  }

  public get selectedColor(): number {
    if (this.colorWell == null) {
      return 0;
    }
    return this.colorWell.transform.colorTransform.color;
  }

  public set selectedColor(param1: number) {
    if (!this._enabled) {
      return;
    }
    this._selectedColor = param1;
    this.rollOverColor = -1;
    0;
    this.currRowIndex = 0;
    this.currColIndex = 0;
    var _loc2_: lib.flash.geom.ColorTransform = new lib.flash.geom.ColorTransform();
    _loc2_.color = param1;
    this.setColorWellColor(_loc2_);
    this.invalidate(InvalidationType.DATA);
  }

  protected setColorDisplay(): void {
    if (!this.swatchMap.length) {
      return;
    }
    var _loc1_: lib.flash.geom.ColorTransform = new lib.flash.geom.ColorTransform(
      0,
      0,
      0,
      1,
      this._selectedColor >> 16,
      (this._selectedColor >> 8) & 255,
      this._selectedColor & 255,
      0
    );
    this.setColorWellColor(_loc1_);
    this.setColorText(this._selectedColor);
    var _loc2_: lib.flash.display.Sprite = this.findSwatch(this._selectedColor);
    this.setSwatchHighlight(_loc2_);
    if (
      this.swatchMap.length &&
      this.colorHash[this._selectedColor] == undefined
    ) {
      this.cleanUpSelected();
    }
  }

  protected setColorText(param1: number): void {
    if (this.textField == null) {
      return;
    }
    this.textField.text = "#" + this.colorToString(param1);
  }

  protected setColorWellColor(param1: lib.flash.geom.ColorTransform): void {
    if (!this.colorWell) {
      return;
    }
    this.colorWell.transform.colorTransform = param1;
  }

  protected setEmbedFonts(): void {
    var _loc1_: any = this.getStyleValue("embedFonts");
    if (_loc1_ != null) {
      this.textField.embedFonts = _loc1_;
    }
  }

  protected setStyles(): void {
    var _loc1_: lib.flash.display.DisplayObject = this.colorWell;
    var _loc2_: any = this.getStyleValue("colorWell");
    if (_loc2_ != null) {
      this.colorWell = this.getDisplayObjectInstance(
        _loc2_
      ) as lib.flash.display.DisplayObject;
    }
    this.addChildAt(this.colorWell, this.getChildIndex(this.swatchButton));
    this.copyStylesToChild(this.swatchButton, ColorPicker.POPUP_BUTTON_STYLES);
    this.swatchButton.drawNow();
    if (_loc1_ != null && this.contains(_loc1_) && _loc1_ != this.colorWell) {
      this.removeChild(_loc1_);
    }
  }

  protected setSwatchHighlight(param1: lib.flash.display.Sprite): void {
    if (param1 == null) {
      if (this.palette.contains(this.swatchSelectedSkin)) {
        this.palette.removeChild(this.swatchSelectedSkin);
      }
      return;
    }
    if (
      !this.palette.contains(this.swatchSelectedSkin) &&
      this.colors.length > 0
    ) {
      this.palette.addChild(this.swatchSelectedSkin);
    } else if (!this.colors.length) {
      return;
    }
    var _loc2_: number = this.getStyleValue("swatchPadding") as number;
    this.palette.setChildIndex(
      this.swatchSelectedSkin,
      this.palette.numChildren - 1
    );
    this.swatchSelectedSkin.x = this.swatches.x + param1.x - 1;
    this.swatchSelectedSkin.y = this.swatches.y + param1.y - 1;
    var _loc3_: any = param1.getChildByName("color").transform.colorTransform
      .color;
    this.currColIndex = this.colorHash[_loc3_].col;
    this.currRowIndex = this.colorHash[_loc3_].row;
  }

  protected setTextEditable(): void {
    if (!this.showTextField) {
      return;
    }
    this.textField.type = !!this.editable
      ? lib.flash.text.TextFieldType.INPUT
      : lib.flash.text.TextFieldType.DYNAMIC;
    this.textField.selectable = this.editable;
  }

  protected showPalette(): void {
    if (this.isOpen) {
      this.positionPalette();
      return;
    }
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.addCloseListener,
      false,
      0,
      true
    );
    this.stage.addChild(this.palette);
    this.isOpen = true;
    this.positionPalette();
    this.dispatchEvent(new lib.flash.events.Event(lib.flash.events.Event.OPEN));
    this.stage.focus = this.textField;
    var _loc1_: lib.flash.display.Sprite = this.selectedSwatch;
    if (_loc1_ == null) {
      _loc1_ = this.findSwatch(this._selectedColor);
    }
    this.setSwatchHighlight(_loc1_);
  }

  public get showTextField(): boolean {
    return this._showTextField;
  }

  public set showTextField(param1: boolean) {
    this.invalidate(InvalidationType.STYLES);
    this._showTextField = param1;
  }
}
