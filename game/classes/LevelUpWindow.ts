import lib from "swf-lib";

export class LevelUpWindow extends lib.flash.display.MovieClip {
  public declare levelNum: lib.flash.text.TextField;

  public declare levelStr: lib.flash.text.TextField;

  public declare okayButton: lib.flash.display.SimpleButton;

  public constructor() {
    super();
  }

  public init(levelN: number, levelTitle: string): any {
    this.levelNum.text = String(levelN);
    this.levelStr.text = String(levelTitle);
    this.okayButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.okay
    );
  }

  public okay(e: lib.flash.events.MouseEvent): any {
    this.okayButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.okay
    );
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
