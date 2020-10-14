export abstract class IHttpProtocolCodec {
  static readonly __IMPL = Symbol(
    "impl: it.gotoandplay.smartfoxserver.http::IHttpProtocolCodec"
  );
  public abstract decode(param1: string): string;

  public abstract encode(param1: string, param2: string): string;
}
