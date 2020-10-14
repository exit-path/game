import lib from "swf-lib";
import { Button } from "../controls/Button";

export abstract class IFocusManager {
  static readonly __IMPL = Symbol("impl: fl.managers::IFocusManager");
  public abstract activate(): void;

  public abstract deactivate(): void;

  public abstract get defaultButton(): Button;

  public abstract set defaultButton(param1: Button);

  public abstract get defaultButtonEnabled(): boolean;

  public abstract set defaultButtonEnabled(param1: boolean);

  public abstract findFocusManagerComponent(
    param1: lib.flash.display.InteractiveObject
  ): lib.flash.display.InteractiveObject;

  public abstract getFocus(): lib.flash.display.InteractiveObject;

  public abstract getNextFocusManagerComponent(
    param1?: boolean
  ): lib.flash.display.InteractiveObject;

  public abstract hideFocus(): void;

  public abstract get nextTabIndex(): number;

  public abstract setFocus(param1: lib.flash.display.InteractiveObject): void;

  public abstract showFocus(): void;

  public abstract get showFocusIndicator(): boolean;

  public abstract set showFocusIndicator(param1: boolean);
}
