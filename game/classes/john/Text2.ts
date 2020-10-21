import lib from "swf-lib";

export class Text2 {
  public constructor() {}

  public static cash(num: number): string {
    return Text2.delimit(num, ",", 3, 2);
  }

  public static commaSnob(num: number): string {
    if (num < 1000) {
      return String(num);
    }
    var len: number = String(num).length;
    var tempArr: any[] = new Array<any>();
    for (var i: number = 0; i < len; i++) {
      tempArr.push(String(num).charAt(len - 1 - i));
    }
    var tempString: string = "";
    for (i = 0; i < len; i++) {
      if (i % 3 == 0 && i != 0) {
        tempString = tempArr[i] + "," + tempString;
      } else {
        tempString = tempArr[i] + tempString;
      }
    }
    return tempString;
  }

  public static delimit(
    num: number,
    delimiter: string = ",",
    delimitMax: number = 3,
    decimals: number = 0
  ): string {
    var str: any = null;
    var val: string = num.toFixed(decimals);
    if (val == "0." && decimals == 0) {
      val = "0";
    }
    var decimalOffset: number = decimals > 0 ? 1 : 0;
    if (val.length <= delimitMax + (decimals + decimalOffset)) {
      return val;
    }
    var endVal: string = val.substring(
      val.length - (decimals + decimalOffset),
      val.length
    );
    var beginVal: string = val.substring(
      0,
      val.length - (decimals + decimalOffset)
    );
    var splitVal: any[] = new Array<any>();
    for (var i: number = beginVal.length; i >= 0; i = i - delimitMax) {
      str = beginVal.substring(i - delimitMax, i);
      if (str != "") {
        splitVal.unshift(str);
      }
    }
    var finalVal: string = "";
    for (var j: number = 0; j < splitVal.length; j++) {
      finalVal =
        finalVal + (splitVal[j] + (j != splitVal.length - 1 ? delimiter : ""));
    }
    finalVal = finalVal + endVal;
    return finalVal;
  }

  public static hexToString(num: number): string {
    lib.__internal.avm2.Runtime.trace(num);
    var tempStr: string = "";
    tempStr = String(num);
    return tempStr;
  }

  public static lower(str: string): string {
    return str.toLowerCase();
  }

  public static parseSentence(str: string): string[] {
    var char: any = null;
    var sWord: any = null;
    var j: any = 0;
    var lastIndex: any = 0;
    var words: string[] = new Array<string>();
    for (var i: number = 0; i < str.length; i++) {
      char = str.charAt(i);
      if (char == " ") {
        sWord = "";
        for (j = lib.__internal.avm2.Runtime.uint(lastIndex); j < i; j++) {
          sWord = sWord + str.charAt(j);
        }
        lastIndex = lib.__internal.avm2.Runtime.uint(i + 1);
        if (sWord != " " && sWord.length >= 1) {
          words.push(sWord);
        }
      }
    }
    words.push(str.substr(lastIndex, str.length));
    return words;
  }

  public static upper(str: string): string {
    return str.toUpperCase();
  }
}
