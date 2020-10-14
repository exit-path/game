import lib from "swf-lib";

export class LoaderFactory {
  private declare currentLoaderIndex: number;

  private static readonly DEFAULT_POOL_SIZE: number = 2;

  private declare errorHandler: Function;

  private declare responseHandler: Function;

  public constructor(
    responseHandler: Function,
    errorHandler: Function,
    poolSize: number = 2
  ) {
    this.responseHandler = responseHandler;
    this.errorHandler = errorHandler;
  }

  public getLoader(): lib.flash.net.URLLoader {
    var urlLoader: lib.flash.net.URLLoader = new lib.flash.net.URLLoader();
    urlLoader.dataFormat = lib.flash.net.URLLoaderDataFormat.TEXT;
    urlLoader.addEventListener(
      lib.flash.events.Event.COMPLETE,
      this.responseHandler
    );
    urlLoader.addEventListener(
      lib.flash.events.IOErrorEvent.IO_ERROR,
      this.errorHandler
    );
    urlLoader.addEventListener(
      lib.flash.events.IOErrorEvent.NETWORK_ERROR,
      this.errorHandler
    );
    return urlLoader;
  }
}
