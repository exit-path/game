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

  public move(xPos: number, yPos: number, animated: boolean) {
    if (!this.lockX && this.limits[0] < this.limits[1]) {
      let targetX = -xPos + this.stageWidth / 2;
      const limitLeft = this.stageWidth / 2 - this.limits[0];
      const limitRight = this.stageWidth / 2 - this.limits[1];
      if (this.enforceLimits) {
        targetX = Math.max(Math.min(targetX, limitLeft), limitRight);
      }

      if (animated) {
        this.target.x = Anim.ease(this.target.x, targetX, this.driftSpeed);
      } else {
        this.target.x = targetX;
      }
    }
    if (!this.lockY) {
      let targetY = -yPos + this.stageHeight / 2;
      const limitUp = this.stageHeight / 2 - this.limits[2];
      const limitDown = this.stageHeight / 2 - this.limits[3];
      if (this.enforceLimits) {
        targetY = Math.max(Math.min(targetY, limitUp), limitDown);
      }

      if (animated) {
        this.target.y = Anim.ease(this.target.y, targetY, this.driftSpeed);
      } else {
        this.target.y = targetY;
      }
    }
    this.camX = this.target.x;
    this.camY = this.target.y;
  }

  public ping(xPos: number, yPos: number): any {
    this.move(xPos, yPos, true);
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
