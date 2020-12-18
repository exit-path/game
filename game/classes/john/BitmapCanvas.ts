import lib from "swf-lib";

export class BitmapCanvas extends lib.flash.display.MovieClip {
  public declare alphaFade: boolean;

  private declare bmp: lib.flash.display.Bitmap;

  private declare bmpData: lib.flash.display.BitmapData;

  private declare bmpOffsetX: number;

  private declare bmpOffsetY: number;

  private declare canvasHeight: number;

  private declare canvasWidth: number;

  public constructor() {
    super();
    this.bmpOffsetX = 0;
    this.bmpOffsetY = 0;
    this.canvasWidth = 0;
    this.alphaFade = true;
    this.canvasHeight = 0;
  }

  public alphaFader(): any {
    var ct: lib.flash.geom.ColorTransform = new lib.flash.geom.ColorTransform(
      1,
      1,
      1,
      0.99,
      0,
      0,
      0,
      0
    );
    this.bmpData.colorTransform(
      new lib.flash.geom.Rectangle(
        this.bmpOffsetX,
        this.bmpOffsetY,
        this.canvasWidth,
        this.canvasHeight
      ),
      ct
    );
  }

  public drawMovieClip(
    mc: lib.flash.display.MovieClip,
    xP: number = 1,
    yP: number = 2,
    rot: number = 3,
    colourTrans: lib.flash.geom.ColorTransform = null,
    blender: string = "normal"
  ): any {
    if (xP == 1 && yP == 2 && rot == 3) {
      xP = mc.x;
      yP = mc.y;
      rot = mc.rotation;
    }
    var translateMatrix: lib.flash.geom.Matrix = new lib.flash.geom.Matrix();
    translateMatrix.translate(xP - this.bmpOffsetX, yP - this.bmpOffsetY);
    if (mc.scaleX == -1) {
      translateMatrix.scale(-1, 1);
      translateMatrix.translate(2 * mc.x, 0);
    }
    this.bmpData.draw(mc, translateMatrix, colourTrans, blender);
  }

  public getAlpha(xPos: number, yPos: number): any {
    var pixelValue: number = this.bmpData.getPixel32(xPos, yPos);
    var alphaValue: number = (pixelValue >> 24) & 255;
    return alphaValue;
  }

  public init(w: number = 550, h: number = 400): any {
    if (this.bmp) {
      this.bmpData.dispose();
      this.removeChild(this.bmp);
    }
    this.bmpData = new lib.flash.display.BitmapData(w, h, true, 16777215);
    this.bmp = new lib.flash.display.Bitmap(this.bmpData);
    this.addChild(this.bmp);
    this.canvasWidth = w;
    this.canvasHeight = h;
  }

  public kill(): any {
    this.bmpData.dispose();
  }

  public lineTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    thick: number = 1,
    colour: number = 0,
    alph: number = 1
  ): any {
    var shape: any = new lib.flash.display.MovieClip();
    shape.graphics.lineStyle(thick, colour, alph);
    shape.graphics.moveTo(x1, y1);
    shape.graphics.lineTo(x2, y2);
    this.drawMovieClip(shape);
    shape = null;
  }

  public ping(): any {
    if (this.alphaFade) {
      this.alphaFader();
    }
  }
}
