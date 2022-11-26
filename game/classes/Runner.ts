import lib from "swf-lib";
import { Skin } from "./Skin";

let isBeamVisible = localStorage.isBeamVisible !== "false";
export class Beam extends lib.flash.display.Shape {
  static get isVisible() {
    return isBeamVisible;
  }
  static set isVisible(value: boolean) {
    isBeamVisible = value;
    localStorage.isBeamVisible = String(value);
  }
}

export class Runner extends Skin {
  public declare body: lib.flash.display.MovieClip;

  readonly beam = new Beam();

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1);

    this.beam.visible = false;
    this.addChildAt(this.beam, 0);
  }

  public frame1(): any {
    this.stop();
  }

  public ping() {
    super.ping();

    this.beam.visible = this.isMain && Beam.isVisible;
  }

  public setColours() {
    super.setColours();

    const transform = new lib.flash.geom.ColorTransform();
    transform.alphaMultiplier = 0.5;
    transform.color = this.colour;
    this.beam.transform.colorTransform = transform;
  }
}
