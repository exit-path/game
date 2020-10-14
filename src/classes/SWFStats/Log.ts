import lib from "swf-lib";

export class Log {
  private static Enabled: boolean = false;

  private static FirstPing: boolean = true;

  public static GUID: string = "";

  private static HighestGoal: number = 0;

  private static readonly PingF: lib.flash.utils.Timer = new lib.flash.utils.Timer(
    60000
  );

  private static readonly PingR: lib.flash.utils.Timer = new lib.flash.utils.Timer(
    30000
  );

  private static Pings: number = 0;

  private static Plays: number = 0;

  private static readonly Random: number = Math.random();

  public declare static SourceUrl: string;

  public static SWFID: number = 0;

  public constructor() {}

  public static CustomMetric(name: string, group: string = null): void {
    if (!Log.Enabled) {
      return;
    }
    if (group == null) {
      group = "";
    }
    Log.Send(
      "CustomMetric",
      "name=" + this.escape(name) + "&group=" + this.escape(group)
    );
  }

  private static ErrorHandler(...args: any[]): void {
    Log.Enabled = false;
  }

  private static GetCookie(n: string): number {
    var cookie: lib.flash.net.SharedObject = lib.flash.net.SharedObject.getLocal(
      "swfstats"
    );
    if (cookie.data[n] == undefined) {
      return 0;
    }
    return lib.__internal.avm2.Runtime.int(cookie.data[n]);
  }

  private static GetUrl(defaulturl: string): string {
    var url: string = null;
    if (lib.flash.external.ExternalInterface.available) {
      try {
        url = String(
          lib.flash.external.ExternalInterface.call(
            "window.location.href.toString"
          )
        );
      } catch (s) {
        url = defaulturl;
      }
    } else if (defaulturl.indexOf("http://") == 0) {
      url = defaulturl;
    }
    if (url == null || url == "" || url == "null") {
      if (
        lib.flash.system.Security.sandboxType == "localWithNetwork" ||
        lib.flash.system.Security.sandboxType == "localTrusted"
      ) {
        url = "http://local-testing/";
      } else {
        url = null;
      }
    }
    return url;
  }

  public static Goal(n: number, name: string): void {}

  public static LevelAverageMetric(
    name: string,
    level: any,
    value: number
  ): void {
    if (!Log.Enabled) {
      return;
    }
    Log.Send(
      "LevelMetricAverage",
      "name=" + this.escape(name) + "&level=" + level + "&value=" + value
    );
  }

  public static LevelCounterMetric(name: string, level: any): void {
    if (!Log.Enabled) {
      return;
    }
    Log.Send("LevelMetric", "name=" + this.escape(name) + "&level=" + level);
  }

  public static LevelRangedMetric(
    name: string,
    level: any,
    value: number
  ): void {
    if (!Log.Enabled) {
      return;
    }
    Log.Send(
      "LevelMetricRanged",
      "name=" + this.escape(name) + "&level=" + level + "&value=" + value
    );
  }

  private static PingServer(...args: any[]): void {
    if (!Log.Enabled) {
      return;
    }
    Log.Pings++;
    Log.Send(
      "Ping",
      (!!Log.FirstPing ? "&firstping=yes" : "") + "&pings=" + Log.Pings
    );
    if (Log.FirstPing) {
      Log.PingF.stop();
      Log.PingR.addEventListener(
        lib.flash.events.TimerEvent.TIMER,
        Log.PingServer
      );
      Log.PingR.start();
      Log.FirstPing = false;
    }
  }

  public static Play(): void {
    if (!Log.Enabled) {
      return;
    }
    Log.Plays++;
    Log.Send("Play", "plays=" + Log.Plays);
  }

  private static SaveCookie(n: string, v: number): void {
    var cookie: lib.flash.net.SharedObject = lib.flash.net.SharedObject.getLocal(
      "swfstats"
    );
    cookie.data[n] = v.toString();
    cookie.flush();
  }

  private static Send(page: string, data: string): void {
    var sendaction: lib.flash.net.URLLoader = new lib.flash.net.URLLoader();
    sendaction.addEventListener(
      lib.flash.events.IOErrorEvent.IO_ERROR,
      Log.ErrorHandler
    );
    sendaction.addEventListener(
      lib.flash.events.HTTPStatusEvent.HTTP_STATUS,
      Log.StatusChange
    );
    sendaction.addEventListener(
      lib.flash.events.SecurityErrorEvent.SECURITY_ERROR,
      Log.ErrorHandler
    );
    sendaction.load(
      new lib.flash.net.URLRequest(
        "http://tracker.swfstats.com/Games/" +
          page +
          ".html?guid=" +
          Log.GUID +
          "&swfid=" +
          Log.SWFID +
          "&" +
          data +
          "&url=" +
          Log.SourceUrl +
          "&" +
          Log.Random
      )
    );
  }

  private static StatusChange(...args: any[]): void {}

  public static View(
    swfid: number = 0,
    guid: string = "",
    defaulturl: string = ""
  ): void {
    Log.SWFID = swfid;
    Log.GUID = guid;
    Log.Enabled = true;
    if (Log.SWFID == 0 || Log.GUID == "") {
      Log.Enabled = false;
      return;
    }
    if (
      defaulturl.indexOf("http://") != 0 &&
      lib.flash.system.Security.sandboxType != "localWithNetwork" &&
      lib.flash.system.Security.sandboxType != "localTrusted"
    ) {
      Log.Enabled = false;
      return;
    }
    Log.SourceUrl = Log.GetUrl(defaulturl);
    if (Log.SourceUrl == null || Log.SourceUrl == "") {
      Log.Enabled = false;
      return;
    }
    lib.flash.system.Security.allowDomain("http://tracker.swfstats.com/");
    lib.flash.system.Security.allowInsecureDomain(
      "http://tracker.swfstats.com/"
    );
    lib.flash.system.Security.loadPolicyFile(
      "http://tracker.swfstats.com/crossdomain.xml"
    );
    lib.flash.system.Security.allowDomain("http://utils.swfstats.com/");
    lib.flash.system.Security.allowInsecureDomain("http://utils.swfstats.com/");
    lib.flash.system.Security.loadPolicyFile(
      "http://utils.swfstats.com/crossdomain.xml"
    );
    var views: number = Log.GetCookie("views");
    views++;
    Log.SaveCookie("views", views);
    Log.Send("View", "views=" + views);
    Log.PingF.addEventListener(
      lib.flash.events.TimerEvent.TIMER,
      Log.PingServer
    );
    Log.PingF.start();
  }
}
