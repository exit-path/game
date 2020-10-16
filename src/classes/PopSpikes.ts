import lib from "swf-lib";

export class PopSpikes extends lib.flash.display.MovieClip {
  public declare inside: lib.flash.display.MovieClipT<{
    spikes: lib.flash.display.MovieClipT<{
      hitA: lib.flash.display.MovieClip;
    }>;
  }>;

  public constructor() {
    super();
    this.parent["createPopSpikes"](this);
  }
}
