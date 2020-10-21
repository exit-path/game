import lib from "swf-lib";

export class ParallaxScrollingBitmap extends lib.flash.display.Bitmap {
  private declare _bottomIndex: number;

  private declare _cameraHeight: number;

  private declare _cameraY: number;

  private declare _mustRender: boolean;

  private declare _oldCamY: number;

  private declare _rect: lib.flash.geom.Rectangle;

  private declare _renderHeight: number;

  private declare _renderPoint: lib.flash.geom.Point;

  public declare _texture: lib.flash.display.BitmapData;

  private declare _topIndex: number;

  public constructor(
    texture: lib.flash.display.BitmapData,
    camHeight: number,
    textureWidth: number = -1
  ) {
    super(
      new lib.flash.display.BitmapData(
        textureWidth > 0 ? textureWidth : texture.height,
        camHeight,
        true,
        0
      )
    );
    this._mustRender = false;
    this._texture = texture;
    this._cameraHeight = camHeight;
    this._cameraY = camHeight;
    this._oldCamY = 0;
    this._rect = new lib.flash.geom.Rectangle(
      0,
      0,
      this._texture.width,
      this._texture.height
    );
    this._topIndex = 0;
    this._bottomIndex = 0;
    this._renderPoint = new lib.flash.geom.Point();
    this.preRender();
  }

  public get cameraHeight(): number {
    return this._cameraHeight;
  }

  public set cameraHeight(value: number) {
    this._cameraHeight = value;
    this._mustRender = true;
  }

  public get cameraY(): number {
    return this._cameraY;
  }

  public set cameraY(value: number) {
    this._cameraY = value;
    this._mustRender = true;
  }

  public destroy(): void {
    this._texture.dispose();
    this._texture = null;
    this.bitmapData.dispose();
    this.bitmapData = null;
  }

  private preRender(): void {
    this._renderHeight = this.bitmapData.height;
    this._renderPoint.y = 0;
    this.bitmapData.lock();
    while (this._renderHeight > 0) {
      this._rect.y = this._bottomIndex;
      if (this._renderHeight > this._texture.height - this._bottomIndex) {
        this._rect.height = this._texture.height - this._bottomIndex;
      } else {
        this._rect.height = this._renderHeight;
      }
      this._renderHeight = this._renderHeight - this._rect.height;
      this.bitmapData.copyPixels(this._texture, this._rect, this._renderPoint);
      this._renderPoint.y = this._renderPoint.y + this._rect.height;
      this._bottomIndex = this._bottomIndex + this._rect.height;
      if (this._bottomIndex >= this._texture.height) {
        this._bottomIndex = 0;
      }
    }
    this.bitmapData.unlock();
  }

  public render(forceRender: boolean = false): void {
    if (!forceRender) {
      if (!this._mustRender) {
        return;
      }
    }
    var scrollY: number = this._oldCamY - this._cameraY;
    this._oldCamY = this._cameraY;
    if (scrollY == 0) {
      return;
    }
    if (scrollY > this.bitmapData.height) {
      scrollY = this.bitmapData.height;
    }
    this._renderHeight = Math.abs(scrollY);
    this.bitmapData.lock();
    this.bitmapData.scroll(0, scrollY);
    if (scrollY < 0) {
      this._renderPoint.y = this.bitmapData.height + scrollY;
      while (this._renderHeight > 0) {
        this._rect.y = this._bottomIndex;
        if (this._renderHeight > this._texture.height - this._bottomIndex) {
          this._rect.height = this._texture.height - this._bottomIndex;
        } else {
          this._rect.height = this._renderHeight;
        }
        this.bitmapData.copyPixels(
          this._texture,
          this._rect,
          this._renderPoint
        );
        this._renderHeight = this._renderHeight - this._rect.height;
        this._renderPoint.y = this._renderPoint.y + this._rect.height;
        if (this._bottomIndex >= this._texture.height) {
          this._bottomIndex =
            this._rect.height - (this._texture.height - this._bottomIndex);
        } else {
          this._bottomIndex = this._bottomIndex + this._rect.height;
        }
        if (this._topIndex >= this._texture.height) {
          this._topIndex =
            this._rect.height - (this._texture.height - this._topIndex);
        } else {
          this._topIndex = this._topIndex + this._rect.height;
        }
      }
    } else {
      while (this._renderHeight > 0) {
        if (
          this._renderHeight >
          this._texture.height - (this._texture.height - this._topIndex)
        ) {
          this._rect.height =
            this._texture.height - (this._texture.height - this._topIndex);
          this._rect.y = this._topIndex - this._rect.height;
          this._renderPoint.y = scrollY - this._rect.height;
        } else {
          this._rect.height = this._renderHeight;
          this._rect.y = this._topIndex - this._rect.height;
          this._renderPoint.y = 0;
        }
        this.bitmapData.copyPixels(
          this._texture,
          this._rect,
          this._renderPoint
        );
        this._renderHeight = this._renderHeight - this._rect.height;
        this._renderPoint.y = this._renderPoint.y - this._rect.height;
        if (this._bottomIndex <= 0) {
          this._bottomIndex =
            this._texture.height - (this._rect.height - this._bottomIndex);
        } else {
          this._bottomIndex = this._bottomIndex - this._rect.height;
        }
        if (this._topIndex <= 0) {
          this._topIndex =
            this._texture.height - (this._rect.height - this._topIndex);
        } else {
          this._topIndex = this._topIndex - this._rect.height;
        }
      }
    }
    this.bitmapData.unlock();
    this._mustRender = false;
  }
}
