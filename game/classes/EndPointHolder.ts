import lib from "swf-lib";

export class EndPointHolder extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    this.parent["createEndPoint"](this);
  }
}
