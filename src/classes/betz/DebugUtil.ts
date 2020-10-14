import lib from "swf-lib";

export class DebugUtil {
  private static _apiName: string = "";

  private static _filters: any[] = new Array<any>();

  private static EXTERN: boolean = false;

  private static ON: boolean = true;

  public constructor() {}

  public static custom(label: string, ...args: any[]): void {
    DebugUtil.output(label, args);
  }

  public static debug(...args: any[]): void {
    DebugUtil.output("DEBUG", args);
  }

  public static error(...args: any[]): void {
    DebugUtil.output("ERROR", args);
  }

  public static fatal(...args: any[]): void {
    DebugUtil.output("FATAL", args);
  }

  public static forceOut(...args: any[]): void {
    DebugUtil.output("OUT", args, true);
  }

  public static getDebugInfo(stackLine: number = 3): string {
    var dirs: any = null;
    var str: any = "";
    var error: Error = new Error();
    var s: string = error.getStackTrace();
    if (s.indexOf("[") == -1) {
      return "";
    }
    var stacks: any[] = s.split("\n");
    var parse: any[] = stacks[stackLine].split("[");
    var line: string = "";
    if (parse[1] != null) {
      dirs = parse[1].split(":");
      line = dirs[dirs.length - 1].substr(0, dirs.length);
      if (line.indexOf("]") != -1) {
        line = line.substring(0, line.length - 1);
      }
    }
    var func: string = parse[0].substring(4);
    str = "[ " + func + (line != "" ? " : " + line : "") + " ]";
    return str;
  }

  public static info(...args: any[]): void {
    DebugUtil.output("INFO", args);
  }

  public static init(
    apiName: string,
    on: boolean = true,
    external: boolean = false,
    filters: any[] = null
  ): void {
    DebugUtil.ON = on;
    DebugUtil.EXTERN = external;
    DebugUtil._apiName = apiName;
    if (!filters) {
      DebugUtil._filters = ["OUT", "ERROR", "WARN", "INFO", "FATAL", "DEBUG"];
    } else {
      DebugUtil._filters = filters;
    }
  }

  public static out(...args: any[]): void {
    DebugUtil.output("OUT", args);
  }

  private static output(
    label: string,
    args: any[],
    force: boolean = false
  ): void {
    if (!force) {
      if (
        DebugUtil._apiName == "" ||
        !DebugUtil.ON ||
        DebugUtil._filters.indexOf(label) == -1
      ) {
        return;
      }
    }
    if (label == "OUT") {
      var label: string = "";
    }
    var msg: string = "[ " + DebugUtil._apiName + " ] -> " + label + ": ";
    for (var i: number = 0; i < args.length; i++) {
      if (args[i] == null) {
        msg = msg + "null ";
      } else {
        msg = msg + (args[i].toString() + " ");
      }
    }
    lib.__internal.avm2.Runtime.trace(msg);
    try {
      if (DebugUtil.EXTERN && lib.flash.external.ExternalInterface.available) {
        lib.flash.external.ExternalInterface.call("console.log", msg);
      }
    } catch (e) {}
  }

  public static warn(...args: any[]): void {
    DebugUtil.output("WARNING", args);
  }
}
