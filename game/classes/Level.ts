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
import { LevelFlags } from "../../shared/level";
import { TriggerBlock } from "./TriggerBlock";

export class Level extends lib.flash.display.MovieClip {
  public declare bouncers: Bouncer[];

  public declare canvas: BitmapCanvas;

  public declare checkPointID: number;

  public declare checkPoints: Checkpoint[];

  public declare createdArray: boolean;

  public declare endPoint: lib.flash.display.MovieClip;

  public declare fallingSpikes: SpikeFall[];

  public declare grinders: Grinder[];

  public declare halfTiles: Tile[];

  public treadmills: Tile[] = [];

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

  public declare maxHeight: number;
  
  public declare minHeight: number;

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

  public declare triggers: TriggerBlock[];

  public declare timeRank: string;

  public declare timeString: string;

  public declare tMaxX: number;

  public declare tMaxY: number;

  public declare toPush: Array<[lib.flash.display.MovieClip, number]>;

  public flags: LevelFlags = LevelFlags.ShowTeleporterName;

  public lockCamX = false;

  public lockCamY = true;

  public constructor() {
    super();
  }

  __preInit() {
    this.minHeight=10000000;
    this.tMaxX = 100;
    this.tMaxY = 50;
    this.levelName = "Multiplayer";
    this.obstacleColour = 13421772;
    this.createdArray = false;
    this.levelColour = 3355443;
    this.lastX = 0;
    this.lastY = 0;
    this.checkPointID = 0;
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
    this.triggers = new Array();
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

  public applyObstacleColour(mov: lib.flash.display.MovieClip, color :number = this.obstacleColour): any {
    Anim.colourMe(mov, color);
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
    this.canvas.init(3000, 3000);
    this.addChild(this.canvas);
  }

  public createTrigger(mov: TriggerBlock) {
    this.triggers.push(mov);
    this.addChild(mov);
    if (mov.name.includes("DEL") && mov.name.includes("1")) {
      mov.color = 0xffff0000;
      //this.toPush.push([mov, 0]);
      if(mov.name.includes("SDEL")) {
        mov.addText();
        mov.name = mov.name.slice(1);
      }
    } else if (mov.name.includes("DEL") && mov.name.includes("2")) {
      mov.color = 0xFFFFFF00;
      if(mov.name.includes("SDEL")) {
        mov.addText();
        mov.name = mov.name.slice(1);
      }
    } else if (mov.name.includes("INF")){
      mov.color = 0xFF0000ff;
    } else if (mov.name.includes("NRM")){
      mov.color = 0xFF0080ff;
    } else if (mov.name.includes("NOF")){
      mov.color = 0xFF00ffff;
    } else if (mov.name.includes("SHW") && mov.name.includes("2")){
      mov.color = 0x00000000;
      if(mov.name.includes("SSHW")) {
        mov.addText();
        mov.name = mov.name.slice(1);
      }
    } else if (mov.name.includes("SHW") && mov.name.includes("1")){
      mov.color = 0xffff0000;
      if(mov.name.includes("SSHW")) {
        mov.addText();
        mov.name = mov.name.slice(1);
      }
    } else if (mov.name.includes("POP")){
      mov.color = 0x00000000;
    } else if (mov.name.includes("STF")) {
      mov.color = 0xFFff66ff;
    } else if (mov.name.includes("JMP")) {
      mov.color = 0xFF4d4d4d;
    } else if (mov.name.includes("GRV")) {
      mov.color = 0xFFefc997
    }
    this.applyObstacleColour(mov, mov.color);
  }

  public createBouncer(mov: Bouncer) {
    this.bouncers.push(mov);
    this.createTileAt(mov, 99);
    this.applyObstacleColour(mov);
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
    this.preInitCheck();
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.canvas.init(3000, 3000);
    this.addChild(this.canvas);

    const pendingTiles: Tile[] = [];
    for (const [holder, tileType] of this.toPush) {
      let tile: Tile;
      if (this.levelType == "SP") {
        tile = new Tile();
      } else {
        tile = new TileOpaque();
      }

      if (holder.rotation % 90 === 0 && holder.rotation !== 0) {
        holder.addChild(tile);
        const bounds = tile.getBounds(this.canvas);
        holder.removeChild(tile);
        tile.x = Math.round(bounds.x);
        tile.y = Math.round(bounds.y);
      } else {
        tile.x = Math.round(holder.x);
        tile.y = Math.round(holder.y);
        tile.rotation = holder.rotation;
      }

      if (tile.x > this.maxWidth) {
        this.maxWidth = tile.x;
      }
      if (tile.y > this.maxHeight) {
        this.maxHeight = tile.y;
      }
      if (tile.y < this.minHeight) {
        this.minHeight = tile.y;
      }
      tile.typeOf = tileType;
      if (tile.typeOf === 3) {
        this.halfTiles.push(tile);
      } else if (
        holder.rotation % 90 == 0 &&
        !(tile.typeOf === 99 && holder.name.startsWith("t"))
      ) {
        this.tiles.push(tile);
        tile.init();
      }

      pendingTiles.push(tile);
      if (tileType != 4) {
        if (this.levelType == "SP") {
          Anim.colourMe(tile, this.levelColour);
        }
      }
      switch (tileType) {
        case 1:
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
          break;

        case 2:
          this.startPoint = tile;
          break;

        case 4:
          this.endPoint = tile;
          break;

        case 5:
        case 6:
          this.treadmills.push(tile);
          break;
      }
    }
    for (const tile of pendingTiles) {
      this.addChild(tile);
    }
    for (const [holder, type] of this.toPush) {
      if (type != 99) {
        this.removeChild(holder);
      }
    }
    for (const tile of pendingTiles) {
      if (tile.currentFrame !== tile.typeOf) {
        tile.gotoAndStop(tile.typeOf);
      } else {
        tile.stop();
      }
    }

    this.toPush.splice(0, this.toPush.length);
    for (let i = 0; i < this.teleporters.length; i++) {
      this.teleporters[i].init();
    }
    for (const treadmill of this.treadmills) {
      treadmill.pingTreadmill();
    }
    for (const trigger of this.triggers) {
      trigger.init();
    }
    this.uniqueLevelInit();
  }

  public init(): any {
    this.levelWidth = this.width;
    this.levelHeight = this.height;
  }

  public kill(): any {
    this.canvas.kill();
  }

  public ping(): any {
    for (const cp of this.checkPoints) {
      for (const flag of cp.checkPointFlags) {
        flag.ping();
      }
    }
    for (const treadmill of this.treadmills) {
      treadmill.pingTreadmill();
    }
  }

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
