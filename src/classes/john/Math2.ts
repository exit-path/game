import lib from "swf-lib";

export class Math2 {
  public constructor() {}

  public static ceilTo(num: number, roundNum: number): any {
    return roundNum * Math.ceil(num / roundNum);
  }

  public static chance(num: number): number {
    var r: number = Math2.random(num);
    if (r == 0) {
      return 1;
    }
    return 0;
  }

  public static degToRad(num: number): number {
    return (num * Math.PI) / 180;
  }

  public static dist(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  public static floorTo(num: number, roundNum: number): any {
    return roundNum * Math.floor(num / roundNum);
  }

  public static getRotationDifference(angA: number, angB: number): any {
    var currentRotation: number = angA;
    var targetRotation: number = angB;
    var difference: number = currentRotation - targetRotation;
    if (difference > 180) {
      targetRotation = targetRotation + 360;
    } else if (difference < -180) {
      targetRotation = targetRotation - 360;
    }
    var changeInRotation: any = targetRotation - currentRotation;
    return changeInRotation;
  }

  public static midPoint(
    pointA: lib.flash.geom.Point,
    pointB: lib.flash.geom.Point
  ): lib.flash.geom.Point {
    var numX: number = (pointA.x + pointB.x) / 2;
    var numY: number = (pointA.y + pointB.y) / 2;
    return new lib.flash.geom.Point(numX, numY);
  }

  public static pythagH(num: number, num2: number): number {
    return Math.sqrt(num * num + num2 * num2);
  }

  public static random(num: number): number {
    return Math.floor(Math.random() * num);
  }

  public static randomBoolean(): boolean {
    var r: number = Math2.random(2);
    if (r == 0) {
      return false;
    }
    return true;
  }

  public static randomColour(): number {
    return Math.random() * 16777215;
  }

  public static range(num1: number): number {
    return num1 - Math2.random(num1 * 2 + 1);
  }

  public static restrict(num: number, min: number, max: number): any {
    return Math.max(Math.min(num, max), min);
  }

  public static roman(n: any): any {
    var xX: any = undefined;
    var d: any = undefined;
    var r: any = "";
    var rn: any = new Array<any>("IIII", "V", "XXXX", "L", "CCCC", "D", "MMMM");
    for (var i: number = 0; i < rn.length; i++) {
      xX = rn[i].length + 1;
      d = n % xX;
      r = rn[i].substr(0, d) + r;
      n = (n - d) / xX;
    }
    r = r.replace(/DCCCC/g, "CM");
    r = r.replace(/CCCC/g, "CD");
    r = r.replace(/LXXXX/g, "XC");
    r = r.replace(/XXXX/g, "XL");
    r = r.replace(/VIIII/g, "IX");
    r = r.replace(/IIII/g, "IV");
    return r;
  }

  public static rotateTo(x1: number, y1: number, x2: number, y2: number): any {
    return (-Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI;
  }

  public static roundDecimal(num: number, places: number): number {
    return (
      lib.__internal.avm2.Runtime.int(num * Math.pow(10, places)) /
      Math.pow(10, places)
    );
  }

  public static roundTo(num: number, roundNum: number): any {
    return roundNum * Math.round(num / roundNum);
  }

  public static toHex(num: number): string {
    var out: string = "";
    var hex: number = 0;
    var val: number = num;
    while (val > 0) {
      hex = val % 16;
      val = val / 16;
      switch (hex) {
        case 10:
          out = "A" + out;
          continue;
        case 11:
          out = "B" + out;
          continue;
        case 12:
          out = "C" + out;
          continue;
        case 13:
          out = "D" + out;
          continue;
        case 14:
          out = "E" + out;
          continue;
        case 15:
          out = "F" + out;
          continue;
        default:
          out = hex + out;
          continue;
      }
    }
    return out;
  }
}
