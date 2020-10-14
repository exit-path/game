import { IHttpProtocolCodec } from "./IHttpProtocolCodec";
import { HttpConnection } from "./HttpConnection";

export class RawProtocolCodec implements IHttpProtocolCodec {
  static readonly [IHttpProtocolCodec.__IMPL] = true;
  private static readonly SESSION_ID_LEN: number = 32;

  public constructor() {}

  public decode(message: string): string {
    var decoded: any = null;
    if (message.charAt(0) == HttpConnection.HANDSHAKE_TOKEN) {
      decoded = message.substr(1, RawProtocolCodec.SESSION_ID_LEN);
    }
    return decoded;
  }

  public encode(sessionId: string, message: string): string {
    return (sessionId == null ? "" : sessionId) + message;
  }
}
