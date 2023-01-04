import lib from "swf-lib";
import { Tile } from "./Tile";

const renderScale = 4;
let treadmillBitmapL: lib.flash.display.BitmapData;
let treadmillBitmapR: lib.flash.display.BitmapData;

export class TileOpaque extends Tile {
  isHighQuality = true;
  bitmap: lib.flash.display.Bitmap;

  public constructor() {
    super();
  }

  public pingTreadmill(): void {
    const shouldUseHighQuality = this.stage.quality === "HIGH";
    if (this.isHighQuality !== shouldUseHighQuality) {
      if (!shouldUseHighQuality) {
        TileOpaque.renderTreadmills(this.tileSize);
        if (this.bitmap == null) {
          this.bitmap = new lib.flash.display.Bitmap(
            this.typeOf === 5 ? treadmillBitmapL : treadmillBitmapR
          );
          this.bitmap.width = this.tileSize;
          this.bitmap.height = this.tileSize;
        }
      }

      if (shouldUseHighQuality) {
        this.removeChild(this.bitmap);
        this.addChild(this.block);
      } else {
        this.removeChild(this.block);
        this.addChild(this.bitmap);
      }
      this.isHighQuality = shouldUseHighQuality;
    }
  }

  static renderTreadmills(tileSize: number): void {
    if (treadmillBitmapL == null) {
      treadmillBitmapL = new lib.flash.display.BitmapData(
        tileSize * renderScale,
        tileSize * renderScale
      );
      const tile = new TileOpaque();
      tile.gotoAndStop(5);

      const t = new lib.flash.geom.Matrix();
      t.scale(renderScale, renderScale);
      treadmillBitmapL.draw(tile, t);
    }
    if (treadmillBitmapR == null) {
      treadmillBitmapR = new lib.flash.display.BitmapData(
        tileSize * renderScale,
        tileSize * renderScale
      );
      const tile = new TileOpaque();
      tile.gotoAndStop(6);

      const t = new lib.flash.geom.Matrix();
      t.scale(renderScale, renderScale);
      treadmillBitmapR.draw(tile, t);
    }
  }
}
