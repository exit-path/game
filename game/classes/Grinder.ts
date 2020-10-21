import lib from "swf-lib";

export class Grinder extends lib.flash.display.MovieClip {
  public declare dist: number;

  public constructor() {
    super();
    this.dist = this.width;
    this.parent["createGrinder"](this);
    this.dist = this.width / 2;
  }
}
