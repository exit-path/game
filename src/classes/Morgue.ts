import lib from "swf-lib";
import { BitmapCanvas } from "./john/BitmapCanvas";
import { Level } from "./Level";
import { BodyPart } from "./BodyPart";
import { Anim } from "./john/Anim";
import { Math2 } from "./john/Math2";

export class Morgue extends lib.flash.display.Sprite {
  private declare bg: BitmapCanvas;

  public declare bodyParts: any[];

  private declare level: Level;

  public constructor() {
    super();
    this.bodyParts = new Array<any>();
  }

  public addDeadBody(plyr: lib.flash.display.MovieClip, colour: number): any {
    var i: number = 0;
    var bodyPart: any = null;
    var player: lib.flash.display.MovieClip = plyr;
    for (i = 0; i < 6; i++) {
      bodyPart = new BodyPart();
      bodyPart.x = player.x;
      bodyPart.y = player.y;
      bodyPart.gotoAndStop(i + 1);
      bodyPart.init(this.level);
      Anim.colourMe(bodyPart, colour);
      bodyPart.colour = colour;
      if (player.y > 500) {
        bodyPart.xVel = Math2.range(5);
        bodyPart.yVel = -10 - Math2.random(20);
      } else {
        bodyPart.xVel = Math2.range(5);
        bodyPart.yVel = Math2.range(5);
      }
      this.addChild(bodyPart);
      this.bodyParts.push(bodyPart);
    }
  }

  public destroy(num: number): any {
    var cTransform: any = null;
    var cur: BodyPart = this.bodyParts[num];
    if (cur.y <= 500) {
      cTransform = new lib.flash.geom.ColorTransform();
      cTransform.color = cur.colour;
      this.bg.drawMovieClip(cur, 1, 2, 3, cTransform);
    }
    this.removeChild(cur);
    this.bodyParts[num] = null;
    this.bodyParts.splice(num, 1);
  }

  public handleBodyParts(): any {
    var cur: any = null;
    for (var i: number = 0; i < this.bodyParts.length; i++) {
      cur = this.bodyParts[i];
      cur.ping();
      this.bg.lineTo(cur.lastX, cur.lastY, cur.x, cur.y, 1, 16777215, 0.3);
      if (
        (Math.round(cur.xVel) == 0 && Math.round(cur.yVel) == 0) ||
        cur.y > 500
      ) {
        cur.deadCounter++;
        if (cur.deadCounter > 5) {
          this.destroy(i);
        }
      }
    }
  }

  public init(lev: Level, b: BitmapCanvas): any {
    this.level = lev;
    this.bg = b;
  }

  public ping(): any {
    this.handleBodyParts();
  }
}
