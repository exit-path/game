import lib from "swf-lib";
import { BitmapCanvas } from "./john/BitmapCanvas";
import { Player } from "./Player";
import { Checkpoint } from "./Checkpoint";
import { Anim } from "./john/Anim";
import { EndPointHolder } from "./EndPointHolder";
import { HalfBlockHolder } from "./HalfBlockHolder";
import { InvisibleTileHolder } from "./InvisibleTileHolder";
import { SpikesHolder } from "./SpikesHolder";
import { Spike } from "./Spike";
import { StartPointHolder } from "./StartPointHolder";
import { TileHolder } from "./TileHolder";
import { Tile } from "./Tile";
import { TileOpaque } from "./TileOpaque";

export class Level extends lib.flash.display.MovieClip {
  public declare arrayMode: boolean;

  public declare bouncers: any[];

  public declare canvas: BitmapCanvas;

  public declare checkPointID: number;

  public declare checkPoints: any[];

  public declare createdArray: boolean;

  public declare endPoint: lib.flash.display.MovieClip;

  public declare fallingSpikes: any[];

  public declare grinders: any[];

  public declare halfTiles: any[];

  public declare laserCannons: any[];

  public declare laserGuns: any[];

  public declare lastX: number;

  public declare lastY: number;

  public declare levelColour: number;

  public declare levelHeight: number;

  public declare levelName: string;

  public declare levelType: string;

  public declare levelWidth: number;

  public declare maxWidth: number;

  public declare obstacleColour: number;

  public declare plates: any[];

  public declare player: Player;

  public declare popSpikes: any[];

  public declare spikes: any[];

  public declare startPoint: lib.flash.display.MovieClip;

  public declare swingingAxes: any[];

  public declare tArr: number[][];

  public declare teleporters: any[];

  public declare tiles: any[];

  public declare timeRank: string;

  public declare timeString: string;

  public declare tMaxX: number;

  public declare tMaxY: number;

  public declare toPush: any[];

  public constructor() {
    super();
    this.tMaxX = 100;
    this.tMaxY = 50;
    this.levelName = "Multiplayer";
    this.obstacleColour = 13421772;
    this.createdArray = false;
    this.levelColour = 3355443;
    this.lastX = 0;
    this.lastY = 0;
    this.checkPointID = 0;
    this.arrayMode = false;
    this.levelWidth = 400;
    this.maxWidth = 0;
    this.levelHeight = 800;
    this.levelType = "SP";
    this.tArr = new Array<number[]>();
    this.toPush = new Array<any>();
    this.canvas = new BitmapCanvas();
    this.timeString = "";
    this.timeRank = "";
    this.popSpikes = new Array<any>();
    this.tiles = new Array<any>();
    this.halfTiles = new Array<any>();
    this.plates = new Array<any>();
    this.laserGuns = new Array<any>();
    this.spikes = new Array<any>();
    this.swingingAxes = new Array<any>();
    this.teleporters = new Array<any>();
    this.fallingSpikes = new Array<any>();
    this.grinders = new Array<any>();
    this.bouncers = new Array<any>();
    this.laserCannons = new Array<any>();
    this.checkPoints = new Array<any>();
  }

  public addCheckpoint(mov: lib.flash.display.MovieClip): any {
    var checkPoint: Checkpoint = new Checkpoint();
    this.addChild(checkPoint);
    checkPoint.x = mov.x;
    checkPoint.y = mov.y;
    checkPoint.id = this.checkPointID;
    this.checkPointID++;
    this.checkPoints.push(checkPoint);
  }

  public applyObstacleColour(mov: lib.flash.display.MovieClip): any {
    Anim.colourMe(mov, this.obstacleColour);
  }

  public createArray(): any {
    var j: number = 0;
    this.tArr.splice(0, this.tArr.length);
    for (var i: number = 0; i < this.tMaxY; i++) {
      this.tArr.push(new Array<number>());
      for (j = 0; j < this.tMaxX; j++) {
        this.tArr[i].push(lib.__internal.avm2.Runtime.uint(0));
      }
    }
    this.canvas.init(3000, 1000);
    this.addChild(this.canvas);
  }

  public createBouncer(mov: lib.flash.display.MovieClip): any {
    this.bouncers.push(mov);
    this.createTileAt(mov, 99);
    this.applyObstacleColour(mov);
    lib.__internal.avm2.Runtime.trace("BOUNCER!", mov);
  }

  public createEndPoint(mov: EndPointHolder): any {
    this.createTileAt(mov, 4);
  }

  public createFallingSpike(mov: lib.flash.display.MovieClip): any {
    this.fallingSpikes.push(mov);
    this.applyObstacleColour(mov);
  }

  public createGrinder(mov: lib.flash.display.MovieClip): any {
    this.grinders.push(mov);
    this.applyObstacleColour(mov);
  }

  public createHalfBlock(mov: HalfBlockHolder): any {
    this.createTileAt(mov, 3);
  }

  public createInvisibleBlock(mov: InvisibleTileHolder): any {
    this.createTileAt(mov, 98);
  }

  public createLaserCannon(mov: lib.flash.display.MovieClip): any {
    this.laserCannons.push(mov);
    this.applyObstacleColour(mov.barrel);
  }

  public createLaserGun(mov: lib.flash.display.MovieClip): any {
    this.laserGuns.push(mov);
    this.applyObstacleColour(mov.gunBarrel);
  }

  public createPlate(mov: lib.flash.display.MovieClip): any {
    this.plates.push(mov);
    this.applyObstacleColour(mov);
  }

  public createPopSpikes(mov: lib.flash.display.MovieClip): any {
    this.popSpikes.push(mov);
    mov.inside.spikes.hitA.visible = false;
    this.applyObstacleColour(mov);
  }

  public createSpike(mov: SpikesHolder): any {
    this.createSpikeAt(mov);
  }

  public createSpikeAt(mov: lib.flash.display.MovieClip): any {
    var spike: Spike = new Spike();
    spike.x = Math.round(mov.x);
    spike.y = Math.round(mov.y);
    spike.rotation = mov.rotation;
    this.addChild(spike);
    spike.hitA.visible = false;
    this.applyObstacleColour(spike);
    this.spikes.push(spike);
    mov.visible = false;
  }

  public createStartPoint(mov: StartPointHolder): any {
    this.createTileAt(mov, 2);
  }

  public createSwingingAxe(mov: lib.flash.display.MovieClip): any {
    this.swingingAxes.push(mov);
    mov.axe.side0.visible = false;
    mov.axe.side1.visible = false;
    this.applyObstacleColour(mov);
  }

  public createTeleporter(mov: lib.flash.display.MovieClip): any {
    this.teleporters.push(mov);
    this.applyObstacleColour(mov);
  }

  public createTile(mov: TileHolder): any {
    this.createTileAt(mov, 1);
  }

  public createTileAt(
    mov: lib.flash.display.MovieClip,
    tileType: number = 1
  ): any {
    this.toPush.push(new Array<any>(mov, tileType));
  }

  public createTreadmillBlock(
    mov: lib.flash.display.MovieClip,
    treadmillDir: string
  ): any {
    if (treadmillDir == "L") {
      this.createTileAt(mov, 5);
    } else {
      this.createTileAt(mov, 6);
    }
  }

  public generateLevel(): any {
    var curTileHolder: any = null;
    var tileType: any = 0;
    var tile: any = null;
    this.preInitCheck();
    this.maxWidth = 0;
    this.canvas.init(3000, 1000);
    this.addChild(this.canvas);
    for (var i: any = 0; i < this.toPush.length; i++) {
      curTileHolder = this.toPush[i][0];
      tileType = lib.__internal.avm2.Runtime.uint(this.toPush[i][1]);
      if (this.levelType == "SP") {
        tile = new Tile();
      } else {
        tile = new TileOpaque();
      }
      tile.x = Math.round(curTileHolder.x);
      tile.y = Math.round(curTileHolder.y);
      if (tile.x > this.maxWidth) {
        this.maxWidth = tile.x;
      }
      tile.typeOf = tileType;
      if (tile.typeOf != 3) {
        this.tiles.push(tile);
        tile.init();
      } else {
        this.halfTiles.push(tile);
      }
      this.addChild(tile);
      if (tileType != 4) {
        if (this.levelType == "SP") {
          Anim.colourMe(tile, this.levelColour);
        }
      }
      tile.gotoAndStop(tile.typeOf);
      if (tileType == 2) {
        this.startPoint = tile;
      }
      if (tileType == 4) {
        this.endPoint = tile;
      }
      if (tileType < 4) {
      }
      if (tileType == 1) {
        if (tile.x < 3000) {
          this.canvas.drawMovieClip(
            tile,
            tile.x,
            tile.y,
            0,
            tile.transform.colorTransform
          );
          tile.visible = false;
        }
      }
      if (this.arrayMode) {
        this.tArr[Math.round(curTileHolder.y / 25)][
          Math.round(curTileHolder.x / 25)
        ] = tileType;
        if (tileType == 1) {
          if (tile.x < 3000) {
            this.canvas.drawMovieClip(tile, tile.x, tile.y);
            this.removeChild(tile);
            tile = null;
          }
        }
      }
      if (tileType != 99) {
        this.removeChild(curTileHolder);
        curTileHolder = null;
      }
    }
    this.toPush.splice(0, this.toPush.length);
    if (this.arrayMode) {
      this.tiles.splice(0, this.tiles.length);
    }
    for (i = 0; i < this.teleporters.length; i++) {
      this.teleporters[i].init();
    }
    this.uniqueLevelInit();
  }

  public getTileArray(): any {
    for (var i: number = 0; i < this.tMaxX; i++) {
      lib.__internal.avm2.Runtime.trace(this.tArr[i]);
    }
  }

  public init(): any {
    this.levelWidth = this.width;
    this.levelHeight = this.height;
  }

  public kill(): any {
    this.canvas.kill();
  }

  public killTiles(): any {
    for (var i: any = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].typeOf == 99) {
        this.removeChild(this.tiles[i]);
        this.tiles[i] = null;
        this.tiles.splice(i, 1);
        i--;
      }
    }
  }

  public ping(): any {}

  public preInitCheck(): any {}

  public repaint(): any {
    for (var i: any = 0; i < this.spikes.length; i++) {
      Anim.colourMe(this.spikes[i], this.obstacleColour);
      this.applyObstacleColour(this.spikes[i]);
    }
    for (i = 0; i < this.swingingAxes.length; i++) {
      Anim.colourMe(this.swingingAxes[i], this.obstacleColour);
    }
    for (i = 0; i < this.teleporters.length; i++) {
      Anim.colourMe(this.teleporters[i], this.obstacleColour);
    }
    for (i = 0; i < this.fallingSpikes.length; i++) {
      Anim.colourMe(this.fallingSpikes[i], this.obstacleColour);
    }
    for (i = 0; i < this.grinders.length; i++) {
      Anim.colourMe(this.grinders[i], this.obstacleColour);
    }
    for (i = 0; i < this.laserCannons.length; i++) {
      Anim.colourMe(this.laserCannons[i].barrel, this.obstacleColour);
    }
    for (i = 0; i < this.bouncers.length; i++) {
      Anim.colourMe(this.bouncers[i], this.obstacleColour);
    }
  }

  public setPlayer(plyr: Player): any {
    this.player = plyr;
  }

  public uniqueLevelInit(): any {}

  public uniqueLevelPing(): any {}
}
