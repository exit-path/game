import lib from "swf-lib";
import { Math2 } from "./john/Math2";

export class Ticker extends lib.flash.display.MovieClip {
  public declare above: lib.flash.display.MovieClipT<{
    let: lib.flash.text.TextField;
  }>;

  public declare belowNow: lib.flash.display.MovieClipT<{
    let: lib.flash.text.TextField;
  }>;

  public declare bottomBack: lib.flash.display.MovieClipT<{
    let: lib.flash.text.TextField;
  }>;

  public declare characters: any[];

  public declare curChar: string;

  public declare curCharacter: number;

  public declare goalCharacter: number;

  public declare prevChar: string;

  public declare prevCharacter: number;

  public declare setCounter: number;

  public declare startingCharacter: number;

  public declare topBack: lib.flash.display.MovieClipT<{
    let: lib.flash.text.TextField;
  }>;

  public constructor(letter: string = null, bool: boolean = false) {
    super();
    this.setCounter = 0;
    this.prevChar = "A";
    this.characters = new Array<any>(
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      " ",
      "!",
      ",",
      ".",
      "_",
      ":"
    );
    this.startingCharacter = 2 + Math2.random(this.characters.length - 3);
    this.curCharacter = this.startingCharacter;
    this.prevCharacter = this.startingCharacter - 1;
    this.goalCharacter = Math2.random(this.characters.length - 1);
    this.curChar = this.characters[this.startingCharacter];
    if (letter == null) {
      this.goalCharacter = this.getPosition(this.name);
    } else {
      this.goalCharacter = this.getPosition(letter);
    }
    if (bool) {
      this.startingCharacter = this.goalCharacter;
    }
  }

  public checkLetters(): any {
    var dist: number = this.goalCharacter - this.curCharacter;
    if (dist < 0) {
      dist = dist + this.characters.length;
    }
    this.setCounter++;
    if (dist >= 3) {
      this.setCounter = 0;
      this.swapLetters();
      this.filters = new Array<any>(new lib.flash.filters.BlurFilter(0, 8, 1));
    } else if (dist >= 2) {
      this.filters = new Array<any>(new lib.flash.filters.BlurFilter(0, 5, 1));
      if (this.setCounter > 3) {
        this.setCounter = 0;
        this.swapLetters();
      }
    } else if (dist >= 1) {
      this.filters = new Array<any>();
      if (this.setCounter > 5) {
        this.setCounter = 0;
        this.swapLetters();
      }
    } else if (dist == 0) {
      if (this.currentFrame == this.totalFrames) {
        this.setCharacters();
        this.stop();
      }
    }
  }

  public getPosition($let: string): any {
    for (var i: any = 0; i < this.characters.length; i++) {
      if ($let == this.characters[i]) {
        return i;
      }
    }
    return 0;
  }

  public newCharacter(char: string, instant: boolean = false): any {
    var tempChar: number = this.goalCharacter;
    if (char == "^") {
      char = this.characters[Math2.random(36)];
    }
    this.goalCharacter = this.getPosition(char);
    if (instant) {
      this.curCharacter = this.goalCharacter;
      this.prevCharacter = tempChar;
      this.curChar = this.characters[this.curCharacter];
      this.prevChar = this.characters[this.prevCharacter];
      this.setCharacters();
      this.gotoAndPlay(1);
    }
  }

  public ping(): any {
    this.checkLetters();
  }

  private setCharacters(): any {
    this.above.let.text = this.prevChar;
    this.topBack.let.text = this.curChar;
    this.belowNow.let.text = this.curChar;
    this.bottomBack.let.text = this.prevChar;
  }

  public swapLetters(): any {
    this.gotoAndPlay(1);
    this.prevCharacter = this.curCharacter;
    this.curCharacter++;
    if (this.curCharacter == this.characters.length) {
      this.curCharacter = 0;
    }
    this.curChar = this.characters[this.curCharacter];
    this.prevChar = this.characters[this.prevCharacter];
    this.setCharacters();
  }
}
