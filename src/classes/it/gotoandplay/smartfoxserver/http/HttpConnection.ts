import lib from "swf-lib";
import { IHttpProtocolCodec } from "./IHttpProtocolCodec";
import { LoaderFactory } from "./LoaderFactory";
import { RawProtocolCodec } from "./RawProtocolCodec";
import { HttpEvent } from "./HttpEvent";

export class HttpConnection extends lib.flash.events.EventDispatcher {
  private declare codec: IHttpProtocolCodec;

  private static readonly CONN_LOST: string = "ERR#01";

  private declare connected: boolean;

  private static readonly DISCONNECT: string = "disconnect";

  private static readonly HANDSHAKE: string = "connect";

  public static readonly HANDSHAKE_TOKEN: string = "#";

  private declare ipAddr: string;

  private static readonly paramName: string = "sfsHttp";

  private declare port: number;

  private static readonly servletUrl: string = "BlueBox/HttpBox.do";

  private declare sessionId: string;

  private declare urlLoaderFactory: LoaderFactory;

  private declare urlRequest: lib.flash.net.URLRequest;

  private declare webUrl: string;

  public constructor() {
    super();
    this.connected = false;
    this.codec = new RawProtocolCodec();
    this.urlLoaderFactory = new LoaderFactory(
      this.handleResponse,
      this.handleIOError
    );
  }

  public close(): void {
    this.send(HttpConnection.DISCONNECT);
  }

  public connect(addr: string, port: number = 8080): void {
    this.ipAddr = addr;
    this.port = port;
    this.webUrl =
      "http://" +
      this.ipAddr +
      ":" +
      this.port +
      "/" +
      HttpConnection.servletUrl;
    this.sessionId = null;
    this.urlRequest = new lib.flash.net.URLRequest(this.webUrl);
    this.urlRequest.method = lib.flash.net.URLRequestMethod.POST;
    this.send(HttpConnection.HANDSHAKE);
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  private handleIOError(error: lib.flash.events.IOErrorEvent): void {
    var params: any = {};
    params.message = error.text;
    var event: HttpEvent = new HttpEvent(HttpEvent.onHttpError, params);
    this.dispatchEvent(event);
  }

  private handleResponse(evt: lib.flash.events.Event): void {
    var event: any = null;
    var loader: lib.flash.net.URLLoader = evt.target as lib.flash.net.URLLoader;
    var data: string = loader.data as string;
    var params: any = {};
    if (data.charAt(0) == HttpConnection.HANDSHAKE_TOKEN) {
      if (this.sessionId == null) {
        this.sessionId = this.codec.decode(data);
        this.connected = true;
        params.sessionId = this.sessionId;
        params.success = true;
        event = new HttpEvent(HttpEvent.onHttpConnect, params);
        this.dispatchEvent(event);
      } else {
        lib.__internal.avm2.Runtime.trace(
          "**ERROR** SessionId is being rewritten"
        );
      }
    } else {
      if (data.indexOf(HttpConnection.CONN_LOST) == 0) {
        params.data = {};
        event = new HttpEvent(HttpEvent.onHttpClose, params);
      } else {
        params.data = data;
        event = new HttpEvent(HttpEvent.onHttpData, params);
      }
      this.dispatchEvent(event);
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public send(message: string): void {
    var vars: any = null;
    var urlLoader: any = null;
    if (
      this.connected ||
      (!this.connected && message == HttpConnection.HANDSHAKE) ||
      (!this.connected && message == "poll")
    ) {
      vars = new lib.flash.net.URLVariables();
      vars[HttpConnection.paramName] = this.codec.encode(
        this.sessionId,
        message
      );
      this.urlRequest.data = vars;
      if (message != "poll") {
        lib.__internal.avm2.Runtime.trace("[ Send ]: " + this.urlRequest.data);
      }
      urlLoader = this.urlLoaderFactory.getLoader();
      urlLoader.data = vars;
      urlLoader.load(this.urlRequest);
    }
  }
}
