import lib from "swf-lib";

export class Anim {
  public constructor() {}

  public static autoElastic(
    target: number,
    speed: number,
    goal: number,
    accel: number,
    friction: number
  ): number {
    speed = speed + (goal - target) * accel;
    speed = speed * friction;
    return speed;
  }

  public static colourMe(
    target: lib.flash.display.MovieClip,
    colour: number
  ): void {
    var setColour: lib.flash.geom.ColorTransform =
      target.transform.colorTransform;
    setColour.color = colour;
    target.transform.colorTransform = setColour;
  }

  public static ease(target: number, goal: number, rate: number): number {
    var targetDist: number = target - goal;
    var moveDist: number = (rate * targetDist) / 2;
    var tempNum: number = target - moveDist;
    return tempNum;
  }

  public static elastic(
    target: number,
    speed: number,
    goal: number,
    accel: number,
    friction: number
  ): number {
    speed = speed + (goal - target) * accel;
    speed = speed * friction;
    return speed;
  }

  public static removeColour(target: lib.flash.display.MovieClip): void {
    target.transform.colorTransform = new lib.flash.geom.ColorTransform();
  }
}
