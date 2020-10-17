import lib from "swf-lib";

export class introLoader_43 extends lib.flash.display.MovieClip {
  public constructor() {
    super();
    if (process.env.NODE_ENV !== "production") {
      this.visible = false;
    }
    this.addFrameScript(95, this.frame96);
  }

  public frame96(): any {
    this.stop();
  }
}
