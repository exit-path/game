import lib from "swf-lib";

export class JSONEncoder {
  private declare jsonString: string;

  public constructor(value: any) {
    this.jsonString = this.convertToString(value);
  }

  private arrayToString(a: any[]): string {
    var s: any = "";
    for (var i: number = 0; i < a.length; i++) {
      if (s.length > 0) {
        s = s + ",";
      }
      s = s + this.convertToString(a[i]);
    }
    return "[" + s + "]";
  }

  private convertToString(value: any): string {
    if (typeof value === "string") {
      return this.escapeString(value as string);
    }
    if (typeof value === "number") {
      return !!this.isFinite(value as number) ? value.toString() : "null";
    }
    if (typeof value === "boolean") {
      return !!value ? "true" : "false";
    }
    if (Array.isArray(value)) {
      return this.arrayToString(value as any[]);
    }
    if (value instanceof Object && value != null) {
      return this.objectToString(value);
    }
    return "null";
  }

  private escapeString(str: string): string {
    var ch: any = null;
    var hexCode: any = null;
    var zeroPad: any = null;
    var s: any = "";
    var len: number = str.length;
    for (var i: number = 0; i < len; i++) {
      ch = str.charAt(i);
      switch (ch) {
        case '"':
          s = s + '\\"';
          break;
        case "\\":
          s = s + "\\\\";
          break;
        case "\b":
          s = s + "\\b";
          break;
        case "\f":
          s = s + "\\f";
          break;
        case "\n":
          s = s + "\\n";
          break;
        case "\r":
          s = s + "\\r";
          break;
        case "\t":
          s = s + "\\t";
          break;
        default:
          if (ch < " ") {
            hexCode = ch.charCodeAt(0).toString(16);
            zeroPad = hexCode.length == 2 ? "00" : "000";
            s = s + ("\\u" + zeroPad + hexCode);
            break;
          }
          s = s + ch;
          break;
      }
    }
    return '"' + s + '"';
  }

  public getString(): string {
    return this.jsonString;
  }

  private objectToString(o: any): string {
    var value: any = null;
    var key: string = null;
    var v: lib.__internal.avm2.XML = null;
    var s: string = "";
    var classInfo: lib.__internal.avm2.XML = lib.flash.utils.describeType(o);
    if (classInfo.name.toString() == "Object") {
      for (key in o) {
        value = o[key];
        if (!(value instanceof Function)) {
          if (s.length > 0) {
            s = s + ",";
          }
          s = s + (this.escapeString(key) + ":" + this.convertToString(value));
        }
      }
    } else {
      {
        /* ERROR: Error: Invalid member expression indexer */
      }
    }
    return "{" + s + "}";
  }
}
