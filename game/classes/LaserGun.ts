import lib from "swf-lib";

export class LaserGun extends lib.flash.display.MovieClip {
  public declare gunBarrel: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.parent["createLaserGun"](this);
  }

  public frame1(): any {
    this.stop();
  }
}
