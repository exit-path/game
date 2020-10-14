import lib from "swf-lib";
import { Player } from "./Player";

export class LaserCannon extends lib.flash.display.MovieClip {
  public declare barrel: lib.flash.display.MovieClip;

  public declare beam: lib.flash.display.MovieClip;

  public declare defaultAngle: number;

  public declare fakeAngle: number;

  public declare foundTarget: boolean;

  public declare setAngle: number;

  public declare timeOut: number;

  public constructor() {
    super();
    this.timeOut = 30;
    this.setAngle = 0;
    this.defaultAngle = 0;
    this.foundTarget = false;
    this.fakeAngle = 0;
    this.parent["createLaserCannon"](this);
    this.beam.visible = false;
    this.defaultAngle = this.rotation;
  }

  public ping(player: Player, players: any[] = null): any {
    if (this.foundTarget) {
    }
  }
}
