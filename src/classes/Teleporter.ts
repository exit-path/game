import lib from "swf-lib";

export class Teleporter extends lib.flash.display.MovieClip {
  public declare lett: lib.flash.text.TextField;

  public declare letter: string;

  public declare partner: Teleporter;

  public declare type: string;

  public constructor() {
    super();
    this.letter = "a";
    this.type = "1";
    this.parent["createTeleporter"](this);
  }

  public init(): any {
    this.letter = this.name.substr(1, 1);
    this.type = this.name.substr(2, 1);
    if (this.type == "1") {
      this.partner = this.parent["t" + this.letter + "2"];
    }
    if (this.type == "2") {
      this.partner = this.parent["t" + this.letter + "1"];
    }
    this.lett.text = this.letter;
  }
}
