export abstract class IFocusManagerComponent {
  static readonly __IMPL = Symbol("impl: fl.managers::IFocusManagerComponent");
  public abstract drawFocus(param1: boolean): void;

  public abstract get focusEnabled(): boolean;

  public abstract set focusEnabled(param1: boolean);

  public abstract get mouseFocusEnabled(): boolean;

  public abstract setFocus(): void;

  public abstract get tabEnabled(): boolean;

  public abstract get tabIndex(): number;
}
