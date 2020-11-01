import lib from "swf-lib";

export class TextPanel extends lib.flash.display.Sprite {
  public txt = new lib.flash.text.TextField();

  constructor() {
    super();
    this.txt.__container.layoutBounds[2] = 50;
    this.txt.__container.layoutBounds[3] = 50;
    this.txt.__container.wordWrap = true;
    this.txt.__container.multiline = true;
    this.txt.__container.defaultTextFormat.color = 0xffffffff;
    this.txt.__container.defaultTextFormat.font = "Bitstream Vera Sans";
    this.txt.__container.defaultTextFormat.size = 12;
    this.txt.width = 50;
    this.txt.height = 50;
    this.addChild(this.txt);
  }
}
