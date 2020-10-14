import lib from "swf-lib";

export class SwingingAxe extends lib.flash.display.MovieClip {
  public declare axe: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this.parent["createSwingingAxe"](this);
  }
}
