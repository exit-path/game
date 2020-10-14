import lib from "swf-lib";
import { ScrollEvent } from "../fl/events/ScrollEvent";
import { ScrollBarDirection } from "../fl/controls/ScrollBarDirection";

export class SimpleScrollBar extends lib.flash.display.MovieClip {
  private declare _maxScrollPosition: number;

  private declare _oldPosition: number;

  private declare _position: number;

  private declare _thumbHeld: boolean;

  public declare bar_mc: lib.flash.display.MovieClip;

  public declare thumb_mc: lib.flash.display.MovieClip;

  public constructor() {
    super();
    this._position = 0;
    this._maxScrollPosition = 1;
    this._thumbHeld = false;
    this._oldPosition = 0;
    this.addEventListener(
      lib.flash.events.Event.ADDED_TO_STAGE,
      this.handleAddedToStage,
      false,
      0,
      true
    );
    this._position = 0;
    this._maxScrollPosition = 1;
  }

  private handleAddedToStage(e: lib.flash.events.Event): void {
    this.removeEventListener(
      lib.flash.events.Event.ADDED_TO_STAGE,
      this.handleAddedToStage
    );
    this._position = 0;
    this._maxScrollPosition = 1;
    this.update();
    this.thumb_mc.y = this.bar_mc.y;
    this.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_DOWN,
      this.handleMouseDown,
      false,
      0,
      true
    );
    this.stage.addEventListener(
      lib.flash.events.MouseEvent.MOUSE_UP,
      this.handleMouseUp,
      false,
      0,
      true
    );
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.handleEnterFrame,
      false,
      0,
      true
    );
  }

  private handleEnterFrame(e: lib.flash.events.Event): void {
    if (this._thumbHeld) {
      this.thumb_mc.y = this.mouseY - this.thumb_mc.height / 2;
      if (this.thumb_mc.y > this.bar_mc.height - this.thumb_mc.height) {
        this.thumb_mc.y = this.bar_mc.height - this.thumb_mc.height;
      }
      if (this.thumb_mc.y < this.bar_mc.y) {
        this.thumb_mc.y = this.bar_mc.y;
      }
      this._oldPosition = this._position;
      this._position =
        this._maxScrollPosition *
        (this.thumb_mc.y / (this.bar_mc.height - this.thumb_mc.height));
      this.dispatchEvent(
        new ScrollEvent(
          ScrollBarDirection.VERTICAL,
          this._position - this._oldPosition,
          this._position
        )
      );
    }
  }

  private handleMouseDown(e: lib.flash.events.MouseEvent): void {
    this._thumbHeld = true;
  }

  private handleMouseUp(e: lib.flash.events.MouseEvent): void {
    this._thumbHeld = false;
  }

  public get height(): number {
    return this.bar_mc.height;
  }

  public get maxScrollPosition(): number {
    return this._maxScrollPosition;
  }

  public set maxScrollPosition(value: number) {
    this._maxScrollPosition = value;
    if (this._maxScrollPosition < 0) {
      this._maxScrollPosition = 0;
    }
    this._position =
      this._maxScrollPosition *
      (this.thumb_mc.y / (this.bar_mc.height - this.thumb_mc.height));
    this.update();
  }

  public get on(): boolean {
    return this.thumb_mc.visible;
  }

  public set on(value: boolean) {
    this.thumb_mc.visible = value;
    this.buttonMode = value;
  }

  public get percent(): number {
    if (this._maxScrollPosition == 0) {
      return 0;
    }
    return this._position / this._maxScrollPosition;
  }

  public get scrollPosition(): number {
    return this._position;
  }

  public set scrollPosition(value: number) {
    this._position = value;
    if (this._position > this._maxScrollPosition) {
      this._position = this._maxScrollPosition;
    }
    if (this._position < 0) {
      this._position = 0;
    }
    this.update();
  }

  private update(): void {
    this.thumb_mc.y =
      (this._position / this._maxScrollPosition) *
      (this.bar_mc.height - this.thumb_mc.height);
    this.on = this._position != this._maxScrollPosition;
  }
}
