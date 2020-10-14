import lib from "swf-lib";
import { LevelEndBox } from "./LevelEndBox";

export class Placing extends lib.flash.display.MovieClip {
  public declare boxy: LevelEndBox;

  public declare kudosButton: lib.flash.display.SimpleButton;

  public declare placingNum: lib.flash.text.TextField;

  public declare playerBorder: lib.flash.display.MovieClip;

  public declare sMute: lib.flash.display.MovieClip;

  public declare timeDisp: lib.flash.text.TextField;

  public constructor() {
    super();
  }
}
