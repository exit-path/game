import lib from "swf-lib";
import { Anim } from "./Anim";

export class HandyCam {
  private declare affineTransform: lib.flash.geom.Matrix;

  public declare camX: number;

  public declare camY: number;

  public declare driftSpeed: number;

  public declare enforceLimits: boolean;

  public declare limits: any[];

  public declare lockX: boolean;

  public declare lockY: boolean;

  public declare stageHeight: number;

  public declare stageWidth: number;

  public declare target: lib.flash.display.MovieClip;

  public declare xPos: number;

  public declare yPos: number;

  public constructor() {
    this.stageHeight = 500;
    this.lockX = false;
    this.lockY = false;
    this.enforceLimits = true;
    this.yPos = 0;
    this.driftSpeed = 0.6;
    this.stageWidth = 800;
    this.camX = 0;
    this.camY = 0;
    this.xPos = 0;
    this.limits = new Array<any>(400, 2000, 0, 0);
  }

  public init(targt: lib.flash.display.MovieClip): any {
    this.target = targt;
  }

  public ping(xPos: number, yPos: number): any {
    var targetX: any = undefined;
    var limitLeft: number = NaN;
    var limitRight: number = NaN;
    var targetY: any = undefined;
    var limitUp: number = NaN;
    var limitDown: number = NaN;
    if (!this.lockX) {
      targetX = 0 - xPos + this.stageWidth / 2;
      limitLeft = 0 - this.limits[0] + this.stageWidth / 2;
      limitRight = 0 - this.limits[1] + this.stageWidth / 2;
      if (this.enforceLimits && targetX > limitLeft) {
        this.target.x = Anim.ease(this.target.x, limitLeft, this.driftSpeed);
      } else if (this.enforceLimits && targetX < limitRight) {
        this.target.x = Anim.ease(this.target.x, limitRight, this.driftSpeed);
      } else {
        this.target.x = Anim.ease(this.target.x, targetX, this.driftSpeed);
      }
    }
    if (!this.lockY) {
      targetY = 0 - yPos + this.stageHeight / 2;
      limitUp = 0 - this.limits[2] + this.stageHeight / 2;
      limitDown = 0 - this.limits[3] + this.stageHeight / 2;
      if (this.enforceLimits && targetY > limitUp) {
        this.target.y = Anim.ease(this.target.y, limitUp, this.driftSpeed);
      } else if (this.enforceLimits && targetY < limitDown) {
        this.target.y = Anim.ease(this.target.y, limitDown, this.driftSpeed);
      } else {
        this.target.y = Anim.ease(this.target.y, targetY, this.driftSpeed);
      }
    }
    this.camX = this.target.x;
    this.camY = this.target.y;
  }

  public rotateAt(angle: number, originX: number, originY: number): void {
    this.affineTransform = this.target.transform.matrix;
    this.affineTransform.translate(-originX, -originY);
    this.affineTransform.rotate(angle);
    this.affineTransform.translate(originX, originY);
    this.target.transform.matrix = this.affineTransform;
  }

  public scaleAt(scale: number, originX: number, originY: number): void {
    this.affineTransform = this.target.transform.matrix;
    this.affineTransform.translate(-originX, -originY);
    this.affineTransform.scale(scale, scale);
    this.affineTransform.translate(originX, originY);
    this.target.transform.matrix = this.affineTransform;
  }
}
