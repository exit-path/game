export abstract class IMessageHandler {
  static readonly __IMPL = Symbol(
    "impl: it.gotoandplay.smartfoxserver.handlers::IMessageHandler"
  );
  public abstract handleMessage(param1: any, param2: string): void;
}
