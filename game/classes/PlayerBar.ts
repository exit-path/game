import lib from "swf-lib";
import { PlayerShell } from "./PlayerShell";

export class PlayerBar extends lib.flash.display.MovieClip {
  public declare nameOf: lib.flash.text.TextField;

  public declare player: PlayerShell;

  public declare posOf: lib.flash.text.TextField;

  public declare timeOf: lib.flash.text.TextField;

  public declare timeTotal: number;

  public constructor() {
    super();
    this.timeTotal = 0;
  }
}
