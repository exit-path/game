export abstract class IFocusManagerGroup {
  static readonly __IMPL = Symbol("impl: fl.managers::IFocusManagerGroup");
  public abstract get groupName(): string;

  public abstract set groupName(param1: string);

  public abstract get selected(): boolean;

  public abstract set selected(param1: boolean);
}
