import lib from "swf-lib";

export class SpikeFall extends lib.flash.display.MovieClip {
  public declare smashState: number;

  public declare spikeIn: lib.flash.display.MovieClipT<{
    hitA: lib.flash.display.MovieClip;
  }>;

  public constructor() {
    super();
    this.smashState = 0;
    this.parent["createFallingSpike"](this);
    this.smashState = 0;
  }
}
