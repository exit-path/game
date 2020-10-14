import lib from "swf-lib";
import { Base64 } from "./Base64";

export class Compressor {
  public constructor() {}

  public static compress(str: string): string {
    var b: lib.flash.utils.ByteArray = new lib.flash.utils.ByteArray();
    b.writeUTFBytes(str);
    b.compress();
    return Base64.Encode(b);
  }

  public static uncompress(str: string): string {
    var b: lib.flash.utils.ByteArray = null;
    try {
      b = Base64.Decode(str);
      b.uncompress();
      return b.toString();
    } catch (e) {
      return null;
    }
    return null;
  }
}
