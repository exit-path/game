import lib from "swf-lib";
import { BaseButton } from "./BaseButton";
import { IFocusManagerComponent } from "../managers/IFocusManagerComponent";
import { InvalidationType } from "../core/InvalidationType";
import { ButtonLabelPlacement } from "./ButtonLabelPlacement";
import { UIComponent } from "../core/UIComponent";
import { ComponentEvent } from "../events/ComponentEvent";

export class LabelButton extends BaseButton implements IFocusManagerComponent {
  static readonly [IFocusManagerComponent.__IMPL] = true;
  protected declare _label: string;

  protected declare _labelPlacement: string;

  protected declare _toggle: boolean;

  public declare static createAccessibilityImplementation: Function;

  private static defaultStyles: any = {
    icon: null,
    upIcon: null,
    downIcon: null,
    overIcon: null,
    disabledIcon: null,
    selectedDisabledIcon: null,
    selectedUpIcon: null,
    selectedDownIcon: null,
    selectedOverIcon: null,
    textFormat: null,
    disabledTextFormat: null,
    textPadding: 5,
    embedFonts: false,
  };

  protected declare icon: lib.flash.display.DisplayObject;

  protected declare mode: string;

  protected declare oldMouseState: string;

  public declare textField: lib.flash.text.TextField;

  public constructor() {
    super();
    this._toggle = false;
    this.mode = "center";
    this._labelPlacement = "right";
    this._label = "Label";
  }

  protected configUI(): void {
    super.configUI();
    this.textField = new lib.flash.text.TextField();
    this.textField.type = lib.flash.text.TextFieldType.DYNAMIC;
    this.textField.selectable = false;
    this.addChild(this.textField);
  }

  protected draw(): void {
    if (this.textField.text != this._label) {
      this.label = this._label;
    }
    if (this.isInvalid(InvalidationType.STYLES, InvalidationType.STATE)) {
      this.drawBackground();
      this.drawIcon();
      this.drawTextFormat();
      this.invalidate(InvalidationType.SIZE, false);
    }
    if (this.isInvalid(InvalidationType.SIZE)) {
      this.drawLayout();
    }
    if (this.isInvalid(InvalidationType.SIZE, InvalidationType.STYLES)) {
      if (this.isFocused && this.focusManager.showFocusIndicator) {
        this.drawFocus(true);
      }
    }
    this.validate();
  }

  protected drawIcon(): void {
    var _loc1_: lib.flash.display.DisplayObject = this.icon;
    var _loc2_: any = !!this.enabled ? this.mouseState : "disabled";
    if (this.selected) {
      _loc2_ =
        "selected" + _loc2_.substr(0, 1).toUpperCase() + _loc2_.substr(1);
    }
    _loc2_ = _loc2_ + "Icon";
    var _loc3_: any = this.getStyleValue(_loc2_);
    if (_loc3_ == null) {
      _loc3_ = this.getStyleValue("icon");
    }
    if (_loc3_ != null) {
      this.icon = this.getDisplayObjectInstance(_loc3_);
    }
    if (this.icon != null) {
      this.addChildAt(this.icon, 1);
    }
    if (_loc1_ != null && _loc1_ != this.icon) {
      this.removeChild(_loc1_);
    }
  }

  protected drawLayout(): void {
    var _loc7_: number = NaN;
    var _loc8_: number = NaN;
    var _loc1_: number = Number(this.getStyleValue("textPadding"));
    var _loc2_: string =
      this.icon == null && this.mode == "center"
        ? ButtonLabelPlacement.TOP
        : this._labelPlacement;
    this.textField.height = this.textField.textHeight + 4;
    var _loc3_: number = this.textField.textWidth + 4;
    var _loc4_: number = this.textField.textHeight + 4;
    var _loc5_: number =
      this.icon == null ? 0 : Number(this.icon.width + _loc1_);
    var _loc6_: number =
      this.icon == null ? 0 : Number(this.icon.height + _loc1_);
    this.textField.visible = this.label.length > 0;
    if (this.icon != null) {
      this.icon.x = Math.round((this.width - this.icon.width) / 2);
      this.icon.y = Math.round((this.height - this.icon.height) / 2);
    }
    if (this.textField.visible == false) {
      this.textField.width = 0;
      this.textField.height = 0;
    } else if (
      _loc2_ == ButtonLabelPlacement.BOTTOM ||
      _loc2_ == ButtonLabelPlacement.TOP
    ) {
      _loc7_ = Math.max(0, Math.min(_loc3_, this.width - 2 * _loc1_));
      if (this.height - 2 > _loc4_) {
        _loc8_ = _loc4_;
      } else {
        _loc8_ = this.height - 2;
      }
      this.textField.width = _loc3_ = _loc7_;
      this.textField.height = _loc4_ = _loc8_;
      this.textField.x = Math.round((this.width - _loc3_) / 2);
      this.textField.y = Math.round(
        (this.height - this.textField.height - _loc6_) / 2 +
          (_loc2_ == ButtonLabelPlacement.BOTTOM ? _loc6_ : 0)
      );
      if (this.icon != null) {
        this.icon.y = Math.round(
          _loc2_ == ButtonLabelPlacement.BOTTOM
            ? Number(this.textField.y - _loc6_)
            : Number(this.textField.y + this.textField.height + _loc1_)
        );
      }
    } else {
      _loc7_ = Math.max(0, Math.min(_loc3_, this.width - _loc5_ - 2 * _loc1_));
      this.textField.width = _loc3_ = _loc7_;
      this.textField.x = Math.round(
        (this.width - _loc3_ - _loc5_) / 2 +
          (_loc2_ != ButtonLabelPlacement.LEFT ? _loc5_ : 0)
      );
      this.textField.y = Math.round((this.height - this.textField.height) / 2);
      if (this.icon != null) {
        this.icon.x = Math.round(
          _loc2_ != ButtonLabelPlacement.LEFT
            ? Number(this.textField.x - _loc5_)
            : Number(this.textField.x + _loc3_ + _loc1_)
        );
      }
    }
    super.drawLayout();
  }

  protected drawTextFormat(): void {
    var _loc1_: any = UIComponent.getStyleDefinition();
    var _loc2_: lib.flash.text.TextFormat = !!this.enabled
      ? (_loc1_.defaultTextFormat as lib.flash.text.TextFormat)
      : (_loc1_.defaultDisabledTextFormat as lib.flash.text.TextFormat);
    this.textField.setTextFormat(_loc2_);
    var _loc3_: lib.flash.text.TextFormat = this.getStyleValue(
      !!this.enabled ? "textFormat" : "disabledTextFormat"
    ) as lib.flash.text.TextFormat;
    if (_loc3_ != null) {
      this.textField.setTextFormat(_loc3_);
    } else {
      _loc3_ = _loc2_;
    }
    this.textField.defaultTextFormat = _loc3_;
    this.setEmbedFont();
  }

  public static getStyleDefinition(): any {
    return this.mergeStyles(
      LabelButton.defaultStyles,
      BaseButton.getStyleDefinition()
    );
  }

  protected initializeAccessibility(): void {
    if (LabelButton.createAccessibilityImplementation != null) {
      LabelButton.createAccessibilityImplementation(this);
    }
  }

  protected keyDownHandler(param1: lib.flash.events.KeyboardEvent): void {
    if (!this.enabled) {
      return;
    }
    if (param1.keyCode == lib.flash.ui.Keyboard.SPACE) {
      if (this.oldMouseState == null) {
        this.oldMouseState = this.mouseState;
      }
      this.setMouseState("down");
      this.startPress();
    }
  }

  protected keyUpHandler(param1: lib.flash.events.KeyboardEvent): void {
    if (!this.enabled) {
      return;
    }
    if (param1.keyCode == lib.flash.ui.Keyboard.SPACE) {
      this.setMouseState(this.oldMouseState);
      this.oldMouseState = null;
      this.endPress();
      this.dispatchEvent(
        new lib.flash.events.MouseEvent(lib.flash.events.MouseEvent.CLICK)
      );
    }
  }

  public get label(): string {
    return this._label;
  }

  public set label(param1: string) {
    this._label = param1;
    if (this.textField.text != this._label) {
      this.textField.text = this._label;
      this.dispatchEvent(new ComponentEvent(ComponentEvent.LABEL_CHANGE));
    }
    this.invalidate(InvalidationType.SIZE);
    this.invalidate(InvalidationType.STYLES);
  }

  public get labelPlacement(): string {
    return this._labelPlacement;
  }

  public set labelPlacement(param1: string) {
    this._labelPlacement = param1;
    this.invalidate(InvalidationType.SIZE);
  }

  public get selected(): boolean {
    return !!this._toggle ? Boolean(this._selected) : false;
  }

  public set selected(param1: boolean) {
    this._selected = param1;
    if (this._toggle) {
      this.invalidate(InvalidationType.STATE);
    }
  }

  protected setEmbedFont(): any {
    var _loc1_: any = this.getStyleValue("embedFonts");
    if (_loc1_ != null) {
      this.textField.embedFonts = _loc1_;
    }
  }

  public get toggle(): boolean {
    return this._toggle;
  }

  public set toggle(param1: boolean) {
    if (!param1 && super.selected) {
      this.selected = false;
    }
    this._toggle = param1;
    if (this._toggle) {
      this.addEventListener(
        lib.flash.events.MouseEvent.CLICK,
        this.toggleSelected,
        false,
        0,
        true
      );
    } else {
      this.removeEventListener(
        lib.flash.events.MouseEvent.CLICK,
        this.toggleSelected
      );
    }
    this.invalidate(InvalidationType.STATE);
  }

  protected toggleSelected(param1: lib.flash.events.MouseEvent): void {
    this.selected = !this.selected;
    this.dispatchEvent(
      new lib.flash.events.Event(lib.flash.events.Event.CHANGE, true)
    );
  }
}
