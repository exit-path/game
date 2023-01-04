import lib from "swf-lib";

export class Tile extends lib.flash.display.MovieClip {
  public declare block: lib.flash.display.MovieClip;

  public declare holdX: number;

  public declare holdY: number;

  public declare myColour: number;

  public declare myName: string;

  public declare painted: boolean;

  public declare posX: number;

  public declare posY: number;

  public declare tileSize: number;

  public declare touched: boolean;

  public declare type: number;

  public declare typeOf: number;

  public constructor() {
    super();
    this.posX = 0;
    this.posY = 0;
    this.holdY = 0;
    this.tileSize = 25;
    this.myColour = 0;
    this.touched = false;
    this.holdX = 0;
    this.type = 1;
    this.painted = false;
  }

  public init(): any {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.holdX = this.x;
    this.holdY = this.y;
    this.posX = Math.floor(this.x / this.tileSize);
    this.posY = Math.floor(this.y / this.tileSize);
    this.name = "tile" + this.posX + "x" + this.posY;
  }

  public pingTreadmill(): void {}
}
