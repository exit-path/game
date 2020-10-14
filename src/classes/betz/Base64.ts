import lib from "swf-lib";

export class Base64 {
  private static _b64Chars: any[] = new Array<any>(
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/"
  );

  private static _b64Lookup: any = Base64._buildB64Lookup();

  private declare static _linebreaks: boolean;

  public constructor() {}

  private static _b64DecodeBuffer(buffer: string): lib.flash.utils.ByteArray {
    var bufferEncBytes: lib.flash.utils.ByteArray = new lib.flash.utils.ByteArray();
    var charValue1: number = Base64._b64Lookup[buffer.charAt(0)];
    var charValue2: number = Base64._b64Lookup[buffer.charAt(1)];
    var charValue3: number = Base64._b64Lookup[buffer.charAt(2)];
    var charValue4: number = Base64._b64Lookup[buffer.charAt(3)];
    bufferEncBytes.writeByte((charValue1 << 2) | (charValue2 >> 4));
    if (buffer.charAt(2) != "=") {
      bufferEncBytes.writeByte((charValue2 << 4) | (charValue3 >> 2));
    }
    if (buffer.charAt(3) != "=") {
      bufferEncBytes.writeByte((charValue3 << 6) | charValue4);
    }
    return bufferEncBytes;
  }

  private static _b64EncodeBuffer(buffer: lib.flash.utils.ByteArray): string {
    var bufferEncStr: any = "";
    bufferEncStr = bufferEncStr + Base64._b64Chars[buffer[0] >> 2];
    switch (buffer.length) {
      case 1:
        bufferEncStr = bufferEncStr + Base64._b64Chars[(buffer[0] << 4) & 48];
        bufferEncStr = bufferEncStr + "==";
        break;
      case 2:
        bufferEncStr =
          bufferEncStr +
          Base64._b64Chars[(buffer[0] << 4) & (48 | (buffer[1] >> 4))];
        bufferEncStr = bufferEncStr + Base64._b64Chars[(buffer[1] << 2) & 60];
        bufferEncStr = bufferEncStr + "=";
        break;
      case 3:
        bufferEncStr =
          bufferEncStr +
          Base64._b64Chars[(buffer[0] << 4) & (48 | (buffer[1] >> 4))];
        bufferEncStr =
          bufferEncStr +
          Base64._b64Chars[(buffer[1] << 2) & (60 | (buffer[2] >> 6))];
        bufferEncStr = bufferEncStr + Base64._b64Chars[buffer[2] & 63];
        break;
      default:
        lib.__internal.avm2.Runtime.trace("Base64 byteBuffer outOfRange");
    }
    return bufferEncStr.toString();
  }

  private static _buildB64Lookup(): any {
    var obj: any = new Object();
    for (var i: any = 0; i < Base64._b64Chars.length; i++) {
      obj[Base64._b64Chars[i]] = i;
    }
    return obj;
  }

  private static _decodeSring(s: string): lib.flash.utils.ByteArray {
    var char: any = null;
    var b64EncString: string = "" + s;
    var b64DecBytes: lib.flash.utils.ByteArray = new lib.flash.utils.ByteArray();
    var stringBuffer: string = "";
    var lgth: number = b64EncString.length;
    for (var i: number = 0; i < lgth; i++) {
      char = b64EncString.charAt(i);
      if (
        !Base64.isWhitespace(char) &&
        (Base64._isBase64(char) || char == "=")
      ) {
        stringBuffer = stringBuffer + char;
        if (stringBuffer.length == 4) {
          b64DecBytes.writeBytes(Base64._b64DecodeBuffer(stringBuffer));
          stringBuffer = "";
        }
      }
    }
    b64DecBytes.position = 0;
    return b64DecBytes;
  }

  private static _encodeBytes(bs: lib.flash.utils.ByteArray): string {
    var bufferSize: any = 0;
    var byteBuffer: any = null;
    var b64EncStr: any = "";
    var col: any = 0;
    bs.position = 0;
    while (bs.position < bs.length) {
      bufferSize = lib.__internal.avm2.Runtime.uint(
        bs.bytesAvailable >= 3
          ? 3
          : lib.__internal.avm2.Runtime.uint(bs.bytesAvailable)
      );
      byteBuffer = new lib.flash.utils.ByteArray();
      bs.readBytes(byteBuffer, 0, bufferSize);
      b64EncStr = b64EncStr + Base64._b64EncodeBuffer(byteBuffer);
      col = lib.__internal.avm2.Runtime.uint(col + 4);
      if (Base64._linebreaks && col % 76 == 0) {
        b64EncStr = b64EncStr + "\n";
        col = 0;
      }
    }
    return b64EncStr.toString();
  }

  private static _isBase64(char: string): boolean {
    return Base64._b64Lookup[char] != undefined;
  }

  public static Decode(str: string): lib.flash.utils.ByteArray {
    return Base64._decodeSring(str);
  }

  public static Encode(
    bArr: lib.flash.utils.ByteArray,
    linebreaks: boolean = false
  ): string {
    Base64._linebreaks = linebreaks;
    return Base64._encodeBytes(bArr);
  }

  public static isWhitespace(char: string): boolean {
    switch (char) {
      case " ":
      case "\t":
      case "\r":
      case "\n":
      case "\f":
        return true;
      default:
        return false;
    }
  }
}
