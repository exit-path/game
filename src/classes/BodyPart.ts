import lib from "swf-lib";
import { TileObject } from "./john/TileObject";
import { Tile } from "./Tile";

export class BodyPart extends TileObject {
  public declare colour: number;

  public declare deadCounter: number;

  public declare gameMode: number;

  public declare hitA: lib.flash.display.MovieClip;

  public declare levelNum: number;

  public declare mySprite: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.levelNum = 0;
    this.colour = 16777215;
    this.gameMode = 0;
    this.deadCounter = 0;
  }

  public hitBlock(mov: lib.flash.display.MovieClip): any {}

  public ping(): any {
    this.playerSize = 1;
    this.thudTresh = 5;
    this.xF = 0.7;
    this.targetObject = this.hitA;
    this.updateTileInteraction();
  }

  public touchBlock(mov: Tile): any {}
}
