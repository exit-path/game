import lib from "swf-lib";
import { LabelButton } from "./LabelButton";
import { IFocusManagerComponent } from "../managers/IFocusManagerComponent";
import { InvalidationType } from "../core/InvalidationType";
import { UIComponent } from "../core/UIComponent";

export class Button extends LabelButton implements IFocusManagerComponent {
  static readonly [IFocusManagerComponent.__IMPL] = true;
  protected declare _emphasized: boolean;

  public declare static createAccessibilityImplementation: Function;

  private static defaultStyles: any = {
    emphasizedSkin: "Button_emphasizedSkin",
    emphasizedPadding: 2,
  };

  protected declare emphasizedBorder: lib.flash.display.DisplayObject;

  public constructor() {
    super();
    this._emphasized = false;
  }

  protected draw(): void {
    if (
      this.isInvalid(InvalidationType.STYLES) ||
      this.isInvalid(InvalidationType.SIZE)
    ) {
      this.drawEmphasized();
    }
    super.draw();
    if (this.emphasizedBorder != null) {
      this.setChildIndex(this.emphasizedBorder, this.numChildren - 1);
    }
  }

  protected drawEmphasized(): void {
    var _loc2_: number = NaN;
    if (this.emphasizedBorder != null) {
      this.removeChild(this.emphasizedBorder);
    }
    this.emphasizedBorder = null;
    if (!this._emphasized) {
      return;
    }
    var _loc1_: any = this.getStyleValue("emphasizedSkin");
    if (_loc1_ != null) {
      this.emphasizedBorder = this.getDisplayObjectInstance(_loc1_);
    }
    if (this.emphasizedBorder != null) {
      this.addChildAt(this.emphasizedBorder, 0);
      _loc2_ = Number(this.getStyleValue("emphasizedPadding"));
      this.emphasizedBorder.x = this.emphasizedBorder.y = -_loc2_;
      this.emphasizedBorder.width = this.width + _loc2_ * 2;
      this.emphasizedBorder.height = this.height + _loc2_ * 2;
    }
  }

  public drawFocus(param1: boolean): void {
    var _loc2_: any = NaN;
    var _loc3_: any = undefined;
    super.drawFocus(param1);
    if (param1) {
      _loc2_ = Number(Number(this.getStyleValue("emphasizedPadding")));
      if (_loc2_ < 0 || !this._emphasized) {
        _loc2_ = 0;
      }
      _loc3_ = this.getStyleValue("focusRectPadding");
      _loc3_ = _loc3_ == null ? 2 : _loc3_;
      _loc3_ = _loc3_ + _loc2_;
      this.uiFocusRect.x = -_loc3_;
      this.uiFocusRect.y = -_loc3_;
      this.uiFocusRect.width = this.width + _loc3_ * 2;
      this.uiFocusRect.height = this.height + _loc3_ * 2;
    }
  }

  public get emphasized(): boolean {
    return this._emphasized;
  }

  public set emphasized(param1: boolean) {
    this._emphasized = param1;
    this.invalidate(InvalidationType.STYLES);
  }

  public static getStyleDefinition(): any {
    return UIComponent.mergeStyles(
      LabelButton.getStyleDefinition(),
      Button.defaultStyles
    );
  }

  protected initializeAccessibility(): void {
    if (Button.createAccessibilityImplementation != null) {
      Button.createAccessibilityImplementation(this);
    }
  }
}
