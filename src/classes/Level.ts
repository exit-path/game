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
import { SwingingAxe } from "./SwingingAxe";
import { LaserCannon } from "./LaserCannon";
import { LaserGun } from "./LaserGun";
import { PopSpikes } from "./PopSpikes";
import { Bouncer } from "./Bouncer";
import { SpikeFall } from "./SpikeFall";
import { Grinder } from "./Grinder";
import { Plate } from "./Plate";
import { Teleporter } from "./Teleporter";

export class Level extends lib.flash.display.MovieClip {
  public declare arrayMode: boolean;

  public declare bouncers: Bouncer[];

  public declare canvas: BitmapCanvas;

  public declare checkPointID: number;

  public declare checkPoints: Checkpoint[];

  public declare createdArray: boolean;

  public declare endPoint: lib.flash.display.MovieClip;

  public declare fallingSpikes: SpikeFall[];

  public declare grinders: Grinder[];

  public declare halfTiles: Tile[];

  public declare laserCannons: LaserCannon[];

  public declare laserGuns: LaserGun[];

  public declare lastX: number;

  public declare lastY: number;

  public declare levelColour: number;

  public declare levelHeight: number;

  public declare levelName: string;

  public declare levelType: string;

  public declare levelWidth: number;

  public declare maxWidth: number;

  public declare obstacleColour: number;

  public declare plates: Plate[];

  public declare player: Player;

  public declare popSpikes: PopSpikes[];

  public declare spikes: Spike[];

  public declare startPoint: lib.flash.display.MovieClip;

  public declare swingingAxes: SwingingAxe[];

  public declare tArr: number[][];

  public declare teleporters: Teleporter[];

  public declare tiles: Tile[];

  public declare timeRank: string;

  public declare timeString: string;

  public declare tMaxX: number;

  public declare tMaxY: number;

  public declare toPush: Array<[lib.flash.display.MovieClip, number]>;

  public constructor() {
    super();
  }

  __preInit() {
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
    this.toPush = new Array();
    this.canvas = new BitmapCanvas();
    this.timeString = "";
    this.timeRank = "";
    this.popSpikes = new Array();
    this.tiles = new Array();
    this.halfTiles = new Array();
    this.plates = new Array();
    this.laserGuns = new Array();
    this.spikes = new Array();
    this.swingingAxes = new Array();
    this.teleporters = new Array();
    this.fallingSpikes = new Array();
    this.grinders = new Array();
    this.bouncers = new Array();
    this.laserCannons = new Array();
    this.checkPoints = new Array();
    super.__preInit();
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

  public createBouncer(mov: Bouncer) {
    this.bouncers.push(mov);
    this.createTileAt(mov, 99);
    this.applyObstacleColour(mov);
    lib.__internal.avm2.Runtime.trace("BOUNCER!", mov);
  }

  public createEndPoint(mov: EndPointHolder) {
    this.createTileAt(mov, 4);
  }

  public createFallingSpike(mov: SpikeFall) {
    this.fallingSpikes.push(mov);
    this.applyObstacleColour(mov);
  }

  public createGrinder(mov: Grinder) {
    this.grinders.push(mov);
    this.applyObstacleColour(mov);
  }

  public createHalfBlock(mov: HalfBlockHolder) {
    this.createTileAt(mov, 3);
  }

  public createInvisibleBlock(mov: InvisibleTileHolder) {
    this.createTileAt(mov, 98);
  }

  public createLaserCannon(mov: LaserCannon) {
    this.laserCannons.push(mov);
    this.applyObstacleColour(mov.barrel);
  }

  public createLaserGun(mov: LaserGun) {
    this.laserGuns.push(mov);
    this.applyObstacleColour(mov.gunBarrel);
  }

  public createPlate(mov: Plate) {
    this.plates.push(mov);
    this.applyObstacleColour(mov);
  }

  public createPopSpikes(mov: PopSpikes) {
    this.popSpikes.push(mov);
    mov.inside.spikes.hitA.visible = false;
    this.applyObstacleColour(mov);
  }

  public createSpike(mov: SpikesHolder) {
    this.createSpikeAt(mov);
  }

  public createSpikeAt(mov: SpikesHolder) {
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

  public createStartPoint(mov: StartPointHolder) {
    this.createTileAt(mov, 2);
  }

  public createSwingingAxe(mov: SwingingAxe) {
    this.swingingAxes.push(mov);
    mov.axe.side0.visible = false;
    mov.axe.side1.visible = false;
    this.applyObstacleColour(mov);
  }

  public createTeleporter(mov: Teleporter) {
    this.teleporters.push(mov);
    this.applyObstacleColour(mov);
  }

  public createTile(mov: TileHolder) {
    this.createTileAt(mov, 1);
  }

  public createTileAt(mov: lib.flash.display.MovieClip, tileType: number = 1) {
    this.toPush.push([mov, tileType]);
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
