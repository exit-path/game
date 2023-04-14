import lib from "swf-lib";
import { main } from "./global";
import { BitmapCanvas } from "./john/BitmapCanvas";
import { HandyCam } from "./john/HandyCam";
import { Level } from "./Level";
import { Emit } from "./john/Emit";
import { EndCountdown } from "./EndCountdown";
import { FadeOut } from "./FadeOut";
import { FreedomSequence } from "./FreedomSequence";
import { Ghosting } from "./Ghosting";
import { LevelEnd } from "./LevelEnd";
import { LevelStart } from "./LevelStart";
import { Logger } from "./john/Logger";
import { Morgue } from "./Morgue";
import { Player } from "./Player";
import { SkyLine } from "./SkyLine";
import { Static } from "./Static";
import { StopWatch } from "./john/StopWatch";
import { Tubes } from "./Tubes";
import { UIPanel } from "./UIPanel";
import { InsideA } from "./InsideA";
import { InsideC } from "./InsideC";
import { InsideB } from "./InsideB";
import { Beam, Runner } from "./Runner";
import { SoundBox } from "./john/SoundBox";
import { AchEvent } from "./AchEvent";
import { StartBeam } from "./StartBeam";
import { Anim } from "./john/Anim";
import { PlayerBar } from "./PlayerBar";
import { Relay } from "./john/Relay";
import { Key } from "./john/Key";
import { Math2 } from "./john/Math2";
import { WhiteSquare } from "./WhiteSquare";
import { YouArrow } from "./YouArrow";
import { FinalA } from "./FinalA";
import { FinalC } from "./FinalC";
import { FinalB } from "./FinalB";
import { LabA } from "./LabA";
import { LabC } from "./LabC";
import { LabB } from "./LabB";
import { SkylineA } from "./SkylineA";
import { SkylineC } from "./SkylineC";
import { SkylineB } from "./SkylineB";
import { StadiumA } from "./StadiumA";
import { StadiumC } from "./StadiumC";
import { StadiumB } from "./StadiumB";
import { PlayerShell } from "./PlayerShell";
import { PlayerObject } from "./PlayerObject";
import { LevelFlags } from "../../shared/level";
import { ExternalEvent } from "./ExternalEvent";

export class Game extends lib.flash.display.MovieClip {
  public declare bg: BitmapCanvas;

  public declare buildStr: string;

  private declare camera: HandyCam;

  public declare cDown: boolean;

  public declare checkPoints: any[];

  public declare cheerCounter: number;

  public declare cLeft: boolean;

  public declare cRight: boolean;

  public declare cUp: boolean;

  private declare curLevel: Level;

  public declare deathScreens: number;

  private declare emit: Emit;

  public declare endCountdown: EndCountdown;

  public declare fadeOut: FadeOut;

  public declare fastSound: boolean;

  public declare finalPlacingArray: any[];

  public declare firstSoundPlay: boolean;

  public declare freedomSequence: FreedomSequence;

  private declare ghosting: Ghosting;

  public declare goAhead: boolean;

  public declare isPaused: boolean;

  public declare keysPressed: any[];

  public declare level: Level;

  public declare level30Okay: boolean;

  public declare levelEnd: LevelEnd;

  public declare levelFinished: boolean;

  public declare levelNum: number;

  public declare levelStart: LevelStart;

  private declare logger: Logger;

  private declare morgue: Morgue;

  public declare mpLevel: number;

  private declare placingBonuses: any[];

  public declare player: Player;

  public declare playerBars: PlayerBar[];

  public declare playerObject: PlayerObject;

  public declare players: PlayerShell[];

  public declare playerSkins: Runner[];

  public declare rewindCounter: number;

  public declare robots: any[];

  public declare sBackward: lib.flash.media.Sound;

  public declare sFast: lib.flash.media.Sound;

  public declare sForward: lib.flash.media.Sound;

  public declare mode: "SP" | "MP" | "PRACTICE";

  public declare skin: Runner;

  public declare skinLayer: lib.flash.display.MovieClip;

  public declare skyLine: SkyLine;

  public declare songPlaying: string;

  public declare soundBackward: lib.flash.media.SoundChannel;

  public declare soundFast: lib.flash.media.SoundChannel;

  public declare soundForward: lib.flash.media.SoundChannel;

  public declare soundRatio: number;

  private declare spaceDown: boolean;

  private declare static: Static;

  public declare tConnected: boolean;

  public declare tCounter: number;

  public declare tCounterGoal: number;

  public declare tempShape: lib.flash.display.Shape;

  public declare timeCounter: number;

  public declare timer: StopWatch;

  private declare tryFrame: number;

  public declare tubes: Tubes;

  private declare uiPanel: UIPanel;

  public declare updateMethod: number;

  public declare updateRate: number;

  public declare updaters: any[];

  public declare xCamX: number;

  public declare yCamY: number;

  public declare youArrows: any[];

  private isPressingKill = false;

  readonly beam = new Beam();

  public constructor() {
    super();
    this.xCamX = 375;
    this.yCamY = 375;
    this.updateMethod = 0;
    this.cLeft = false;
    this.fastSound = false;
    this.tCounter = 0;
    this.levelFinished = false;
    this.firstSoundPlay = true;
    this.cUp = false;
    this.updateRate = 7;
    this.mode = "PRACTICE";
    this.songPlaying = "none";
    this.levelNum = 0;
    this.tryFrame = 0;
    this.deathScreens = 0;
    this.cRight = false;
    this.level30Okay = false;
    this.timeCounter = 0;
    this.mpLevel = 100;
    this.cDown = false;
    this.goAhead = false;
    this.rewindCounter = 0;
    this.spaceDown = false;
    this.buildStr = "0.2.3";
    this.cheerCounter = 0;
    this.isPaused = false;
    this.tConnected = false;
    this.camera = new HandyCam();
    this.logger = new Logger();
    this.ghosting = new Ghosting();
    this.placingBonuses = new Array<any>(250, 150, 100, 50);
    this.bg = new BitmapCanvas();
    this.skinLayer = new lib.flash.display.MovieClip();
    this.morgue = new Morgue();
    this.uiPanel = new UIPanel();
    this.timer = new StopWatch();
    this.emit = new Emit();
    this.robots = new Array<any>();
    this.tempShape = new lib.flash.display.Shape();
    this.playerBars = new Array<any>();
    this.checkPoints = new Array<any>();
    this.youArrows = new Array<any>();
    this.skyLine = new SkyLine();
    this.sForward = new InsideA();
    this.sBackward = new InsideC();
    this.sFast = new InsideB();
    this.players = new Array<any>();
    this.tCounterGoal = this.updateRate;
    this.keysPressed = new Array<any>(false, false, false, false);
    this.updaters = new Array<any>(0, 0, 0, 0, 0, 0, 0, 0);
    this.finalPlacingArray = new Array<any>();
    this.playerSkins = new Array<any>();

    this.beam.visible = false;
  }

  public added(e: lib.flash.events.Event): any {
    this.stage.focus = this.stage;
  }

  public addSkin(): any {
    if (this.skin) {
      this.removeChild(this.skin);
    }
    this.skin = new Runner();
    this.addChild(this.skin);
    this.skin.init(this.player, this.level.checkPoints);
    this.skin.headType = this.player.headType;
    this.skin.handType = this.player.handType;
  }

  public checkPoint(): any {
    if (this.tConnected) {
      this.tubes.onCheckpoint(this.curLevel.startPoint["id"]);
    }
  }

  public chooseMultiplayerSong(): any {
    this.startFinal();
  }

  public chooseSong(): any {
    if (this.levelNum <= 2) {
      this.startInside();
    } else if (this.levelNum <= 9) {
      this.startStadium();
    } else if (this.levelNum <= 10) {
      this.startInside();
    } else if (this.levelNum <= 14) {
      this.startLab();
    } else if (this.levelNum <= 15) {
      this.startInside();
    } else if (this.levelNum <= 16) {
      this.startLab();
      SoundBox.stopAllSounds();
      this.songPlaying = "none";
    } else if (this.levelNum <= 19) {
      this.startLab();
    } else if (this.levelNum <= 24) {
      this.startSkyline();
    } else if (this.levelNum <= 29) {
      this.startFinal();
    } else if (this.levelNum == 30) {
    }
  }

  public collectSign(): any {
    this.playerObject.signs[this.levelNum] = true;
    var signCount: any = 0;
    for (var i: any = 0; i < this.playerObject.signs.length; i++) {
      if (this.playerObject.signs[i] == true) {
        signCount++;
      }
    }
    if (signCount >= 1) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 15));
    }
    if (signCount >= 8) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 16));
    }
    if (signCount >= 15) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 17));
    }
    if (signCount >= 24) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 18));
    }
    if (signCount >= 30) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 19));
    }
    this.updateUISign();
    this.uiPanel["caution"].gotoAndPlay(2);
  }

  public countDownFinish(): any {
    this.goAhead = true;
  }

  public countdownStart(): any {
    this.levelStart = new LevelStart();
    this.levelStart.gotoAndPlay(1);
    this.addChild(this.levelStart);
    if (this.uiPanel && this.contains(this.uiPanel)) {
      this.levelStart.startBox.levelName.nameOf.text =
        this.uiPanel.levName.text;
    }
  }
  
  public createNewLevel(): any {
    this.levelFinished = false;
    this.tryFrame = 0;
    this.checkPoints.splice(0, this.checkPoints.length);
    this.level.kill();
    this.removeChild(this.level);
    this.level = null;
    this.curLevel = null;
    this.setLevel();
    this.player.init(this.level);
    this.player.initPlayer();
    this.player.visible = false;
    this.camera.camX = 0;
    this.camera.camY = 0;
    this.x = 0;
    this.y = 0;
    if (this.mode === "SP") {
      this.uiPanel.placing.visible = false;
    } else {
      this.uiPanel.placing.visible = true;
    }
    this.finalPlacingArray.splice(0, this.finalPlacingArray.length);
    for (var i: any = 0; i < this.playerBars.length; i++) {
      this.uiPanel.removeChild(this.playerBars[i]);
      this.playerBars[i] = null;
    }
    this.playerBars.splice(0, this.playerBars.length);
    this.startLevel();
  }

  public emitBeam(xP: number, yP: number, wid: number): any {
    var startBeam: StartBeam = new StartBeam();
    this.addChild(startBeam);
    startBeam.x = xP;
    startBeam.y = yP;
    startBeam.width = wid;
    Anim.colourMe(startBeam, this.player.colour);
    this.emit.manage(startBeam);
  }

  public endMPGame(): any {
    var nextToGo: any = null;
    var remI: any = NaN;
    var playerBar: any = null;
    if (this.player.rewinding) {
      this.stopRewinding();
    }
    this.removeChild(this.endCountdown);
    this.endCountdown = null;
    this.levelEnd = new LevelEnd();
    this.addChild(this.levelEnd);
    this.levelEnd.x = 0 - this.x;
    this.levelEnd.y = 0 - this.y;
    this.goAhead = false;
    var tempArray: any[] = new Array<any>();
    for (var i: any = 0; i < this.players.length; i++) {
      if (this.players[i].completedLevel == false) {
        tempArray.push(this.players[i]);
      }
    }
    while (tempArray.length > 0) {
      nextToGo = tempArray[0];
      remI = 0;
      for (i = 0; i < tempArray.length; i++) {
        if (nextToGo.x > tempArray[i].x) {
          nextToGo = tempArray[i];
          remI = Number(i);
        }
      }
      playerBar = new PlayerBar();
      this.uiPanel.addChild(playerBar);
      playerBar.x = 800;
      playerBar.y = 180 + this.playerBars.length * 30;
      playerBar.timeTotal = 0;
      playerBar.nameOf.text = nextToGo.userName;
      playerBar.player = nextToGo;
      this.playerBars.push(playerBar);
      this.finalPlacingArray.push(playerBar);
      tempArray.splice(remI, 1);
    }

    this.dispatchEvent(new ExternalEvent({ type: "mp-game-end" }));
  }

  public endEnding(): any {
    this.level30Okay = true;
  }

  public endFadeOut(): any {
    if (!this.fadeOut) {
      return;
    }
    this.fadeOut.stop();
    this.removeChild(this.fadeOut);
    this.fadeOut = null;
  }

  public endSoundBackward(e: lib.flash.events.Event): any {
    this.soundBackward.stop();
    this.soundBackward = this.sBackward.play(0, 99999);
  }

  public endSoundFast(e: lib.flash.events.Event): any {
    this.soundFast.stop();
    this.soundFast = this.sFast.play(0, 99999);
  }

  public endSoundForward(e: lib.flash.events.Event): any {
    this.soundForward.stop();
    this.soundForward = this.sForward.play(0, 99999);
  }

  public exitOut(e: lib.flash.events.MouseEvent = null): any {
    SoundBox.stopAllSounds();
    if (this.mode === "SP") {
      this.playerObject.gameLevel = this.levelNum;
      if (this.levelNum != 0) {
        this.playerObject.gameTime = this.timer.getTimeAsTotalSeconds();
      }
      this.dispatchEvent(new Relay(Relay.GOTO, "Game", "SinglePlayerMenu"));
    } else if (this.mode === "PRACTICE") {
      this.dispatchEvent(new Relay(Relay.GOTO, "Game", "EndPractice"));
    } else if (this.mode === "MP") {
      this.dispatchEvent(new Relay(Relay.GOTO, "Game", "QuitMP"));
    }
  }

  public finishLevel(): any {
    var i: any = NaN;
    if (this.mode === "SP" || this.mode === "PRACTICE") {
      this.levelFinished = true;
      this.fadeOut = new FadeOut();
      this.fadeOut.gotoAndPlay(2);
      if (this.player.burningFlow) {
        this.player.burningFlow = false;
        this.stopBurningFlowMusic();
      }
      this.organizeDepth();
      this.addChild(this.fadeOut);
      this.fadeOut.x = 0 - this.x;
      this.fadeOut.y = 0 - this.y;
    } else if (this.mode === "MP") {
      this.uiPanel.arrowKeysToPan.gotoAndStop(2);
      this.xCamX = this.player.x;
      this.yCamY = this.player.y;
      this.levelFinished = true;
      for (i = 0; i < this.players.length; i++) {
        if (this.players[i].isPlayer) {
          this.players[i].time = this.timer.getFrameTime();
          this.iAmDone(this.players[i]);
        }
      }
    }
  }

  public handleCamera(): any {
    if (this.mode !== "SP") {
      const viewWidth = this.level.maxWidth;
      const viewHeight = Math.max(this.level.maxHeight, 225);
      if (this.mode === "MP" && this.player.completedLevel) {
        if (Key.isDown(Key.LEFT)) {
          this.xCamX -= 20;
        }
        if (Key.isDown(Key.RIGHT)) {
          this.xCamX += 20;
        }
        if (Key.isDown(Key.UP)) {
          this.yCamY -= 20;
        }
        if (Key.isDown(Key.DOWN)) {
          this.yCamY += 20;
        }
        this.xCamX = Math.min(Math.max(this.xCamX, 400), viewWidth - 400);
        this.yCamY = Math.min(Math.max(this.yCamY, 250), viewHeight - 225);
        this.camera.limits = new Array<any>(
          400,
          viewWidth - 400,
          250,
          viewHeight - 225
        );
        this.camera.ping(this.xCamX, this.yCamY);
      } else if (!this.levelFinished) {
        this.camera.limits = new Array<any>(
          400,
          viewWidth - 400,
          250,
          viewHeight - 225
        );
        this.camera.ping(this.player.x, this.player.y);
      }
    } else {
      this.camera.limits = new Array<any>(400, this.level.maxWidth - 400, 0, 0);
      if (this.player.burningFlow) {
        const tempTrans = new lib.flash.geom.ColorTransform();
        tempTrans.color = 16777215;
        this.camera.ping(this.player.x + 200, this.player.y);
        this.skin.filters = new Array<any>(
          new lib.flash.filters.GlowFilter(
            39423,
            1,
            15,
            15,
            1.5,
            1,
            false,
            true
          )
        );
        if (this.stage.quality === "HIGH") {
          this.bg.drawMovieClip(this.skin, 1, 2, 3, tempTrans);
        }
      } else {
        this.camera.ping(this.player.x, this.player.y);
        this.skin.filters = new Array<any>();
      }
    }
  }

  public handleCheering(): any {}

  public handleLaserCannons(): any {
    var curCannon: any = null;
    var speedRot: any = NaN;
    var vel: any = NaN;
    var xR: number = NaN;
    var yR: number = NaN;
    var iter: any = NaN;
    var willFire: boolean = false;
    var j: any = NaN;
    var curX: number = NaN;
    var curY: number = NaN;
    var xR2: number = NaN;
    var yR2: number = NaN;
    var totalDist: number = NaN;
    var k: any = NaN;
    var ws: any = null;
    var laserCannons: any[] = this.level.laserCannons;
    for (var i: any = 0; i < laserCannons.length; i++) {
      curCannon = laserCannons[i];
      curCannon.setAngle = Math2.rotateTo(
        this.player.x,
        this.player.y,
        curCannon.x,
        curCannon.y
      );
      speedRot = 0.1;
      if (curCannon.timeOut >= 25) {
        speedRot = 0.5;
      } else {
        speedRot = 0.1;
      }
      curCannon.rotation = Anim.ease(
        curCannon.rotation,
        curCannon.rotation +
          Math2.getRotationDifference(curCannon.rotation, curCannon.fakeAngle),
        speedRot
      );
      vel = 10;
      xR = vel * Math.sin((Math.PI / 180) * curCannon.setAngle);
      yR = 0 - vel * Math.cos((Math.PI / 180) * curCannon.setAngle);
      iter = 50;
      willFire = false;
      for (j = 3; j < iter; j++) {
        curX = xR * j + curCannon.x;
        curY = yR * j + curCannon.y;
        if (this.level.canvas.getAlpha(curX, curY) > 0) {
          this.tempShape.graphics.clear();
          this.tempShape.graphics.lineStyle(1, 16777215, 1);
          this.tempShape.graphics.moveTo(curCannon.x, curCannon.y);
          this.tempShape.graphics.lineTo(curX, curY);
          this.addChild(this.tempShape);
          if (this.player.hitTestObject(this.tempShape)) {
            willFire = true;
            curCannon.fakeAngle = curCannon.setAngle;
          }
          this.tempShape.graphics.clear();
          break;
        }
      }
      if (willFire) {
        curCannon.timeOut = 0;
        if (curCannon.beam.visible == false) {
          SoundBox.playSound("Zap");
        }
        curCannon.beam.visible = true;
      }
      curCannon.timeOut++;
      if (curCannon.timeOut >= 25) {
        curCannon.fakeAngle = curCannon.defaultAngle;
        curCannon.beam.visible = false;
      } else {
        xR2 = vel * Math.sin((Math.PI / 180) * curCannon.rotation);
        yR2 = 0 - vel * Math.cos((Math.PI / 180) * curCannon.rotation);
        j = 3;
        while (j < iter) {
          curX = xR2 * j + curCannon.x;
          curY = yR2 * j + curCannon.y;
          if (
            Math2.dist(curX, curY, this.player.x, this.player.y) < 10 &&
            !this.player.rewinding
          ) {
            this.kill();
            return;
          }
          if (this.level.canvas.getAlpha(curX, curY) > 0) {
            totalDist = Math2.dist(curCannon.x, curCannon.y, curX, curY) - 30;
            curCannon.beam.height = totalDist;
            for (k = 0; k < 5; k++) {
              ws = new WhiteSquare();
              ws.x = curX + Math2.range(5);
              ws.y = curY + Math2.range(2);
              ws.scaleX = Math.random() * 0.5 + 0.5;
              ws.scaleY = Math.random() * 0.5 + 0.5;
              this.addChild(ws);
              this.emit.manage(ws);
            }
            break;
          }
          j++;
        }
      }
    }
  }

  public handleYouArrows(): any {
    for (var i: number = 0; i < this.youArrows.length; i++) {
      this.youArrows[i].x = Anim.ease(
        this.youArrows[i].x,
        this.youArrows[i].skin.x,
        0.8
      );
      this.youArrows[i].y = Anim.ease(
        this.youArrows[i].y,
        this.youArrows[i].skin.y - 30,
        0.8
      );
    }
  }

  public hotKeys(): any {
    if (Key.isDown(lib.flash.ui.Keyboard.SPACE)) {
      if (!this.spaceDown) {
        this.spaceDown = true;
      }
    } else {
      this.spaceDown = false;
    }
  }

  public hub(e: Relay): any {
    switch (e.sender) {
      case "KILL":
        this.kill();
        break;
      case "CHECK":
        this.checkPoint();
        break;
      case "Results":
    }
  }

  public iAmDone(player: PlayerShell) {
    if (player.completedLevel) {
      return;
    }
    player.completedLevel = true;
    const playerBar = new PlayerBar();
    this.uiPanel.addChild(playerBar);
    playerBar.x = 800;
    playerBar.y = 180 + this.playerBars.length * 30;
    playerBar.timeTotal = player.time;
    playerBar.nameOf.text = player.userName;
    playerBar.player = player;
    this.playerBars.push(playerBar);
    this.tSortTimes();
  }

  public init(tuber: Tubes, playerObj: PlayerObject, level: number) {
    this.addChild(this.skyLine);
    this.playerObject = playerObj;
    if (this.mode === "SP") {
      if (this.playerObject.gameLevel == 0) {
        this.timer.setTimeAsTotalSeconds(0);
      } else {
        this.timer.setTimeAsTotalSeconds(this.playerObject.gameTime);
      }
      this.levelNum = level;
    } else if (this.mode === "MP") {
      this.tubes = tuber;
      this.updateMethod = 0;
      this.levelNum = level;
    } else if (this.mode === "PRACTICE") {
      this.timer.setTimeAsTotalSeconds(0);
      this.levelNum = level;
    }
    this.setLevel();
    this.player = new Player();
    this.player.x = -200;
    this.player.y = -200;
    this.player.userName = this.playerObject.userName;
    this.player.xp = this.playerObject.xp;
    this.player.kudos = this.playerObject.kudos;
    this.player.wins = this.playerObject.wins;
    this.player.matches = this.playerObject.matches;
    this.player.headType = this.playerObject.headType;
    this.player.handType = this.playerObject.handType;
    this.player.colour = this.playerObject.colour;
    this.player.colour2 = this.playerObject.colour2;
    this.player.init(this.level);
    this.player.initPlayer();
    this.player.visible = false;
    if (this.mode !== "MP") {
      this.uiPanel.placing.visible = false;
    } else {
      this.uiPanel.placing.visible = !!this.tubes?.player;
    }
    this.bg.init(2000, 800);
    this.addChild(this.bg);
    this.addSkin();
    this.ghosting.init(this.logger.logs);
    this.addChild(this.ghosting);
    this.addChild(this.player);
    this.addChild(this.morgue);
    this.morgue.init(this.level, this.bg);
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.ping,
      false,
      0,
      true
    );
    this.addEventListener(Relay.SEND, this.hub, false, 0, true);
    this.addEventListener(
      lib.flash.events.Event.ADDED_TO_STAGE,
      this.added,
      false,
      0,
      true
    );
    this.uiPanel.exitButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.exitOut,
      false,
      0,
      true
    );
    this.uiPanel.muteButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.muteOut,
      false,
      0,
      true
    );
    this.uiPanel.pauseButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.pauseOut,
      false,
      0,
      true
    );
    this.uiPanel.qualityButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.qualityOut,
      false,
      0,
      true
    );
    this.camera.init(this);
    this.camera.lockX = this.level.lockCamX;
    this.camera.lockY = this.level.lockCamY;
    this.addChild(this.uiPanel);
    this.addChild(this.emit);
    this.level.createArray();
    this.startLevel();
    this.updatePing(0);
    var newYouArrow: YouArrow = new YouArrow(this.skin, this.player);
    this.addChild(newYouArrow);
    this.youArrows.push(newYouArrow);
    this.initSounds();
    this.organizeDepth();
    if (this.mode === "SP") {
      this.chooseSong();
    } else {
      this.chooseMultiplayerSong();
      this.stage.focus = this.stage;
    }
  }

  public initMP(): any {
    var newSkin: any = null;
    var newYouArrow: any = null;
    this.players = this.tubes.players;
    this.player.x = this.level.startPoint.x + 17.5;
    this.player.y = this.level.startPoint.y;
    for (var i: any = 0; i < this.players.length; i++) {
      this.players[i].completedLevel = false;
      if (!this.players[i].isPlayer) {
        newSkin = new Runner();
        newSkin.x = this.players[i].xPos;
        newSkin.y = this.players[i].yPos;
        newSkin.setChecks(this.level.checkPoints);
        newSkin.isMain = false;
        this.skinLayer.addChild(newSkin);
        this.playerSkins.push(newSkin);
        newYouArrow = new YouArrow(newSkin, this.players[i]);
        this.youArrows.push(newYouArrow);
        newSkin.youArrow = newYouArrow;
        this.addChild(newYouArrow);
      } else {
        this.players[i].time = 0;
        this.playerSkins.push(null);
        this.skin.x = this.player.x;
        this.skin.y = this.player.y;
      }
    }

    this.bg.ping();
    this.skyLine.ping();
    this.uiPanel.ping(this.camera, this.player);
    this.level.setPlayer(this.player);
    this.levelStart.x = -this.camera.camX;
    this.levelStart.y = -this.camera.camY;

    if (!this.tubes.player) {
      this.player.completedLevel = true;
      this.skin.visible = false;
      this.finishLevel();
    }
    this.dispatchEvent(new ExternalEvent({ type: "mp-game-init" }));
  }

  public initPractice() {
    this.bg.ping();
    this.skyLine.ping();
    this.uiPanel.ping(this.camera, this.player);
    this.level.setPlayer(this.player);
    this.goAhead = true;
  }

  public initSounds(): any {
    this.soundRatio = this.sForward.length / this.sBackward.length;
    this.firstSoundPlay = true;
  }

  public kill(): any {
    if (this.player.rewinding) {
      return;
    }
    if (
      this.mode === "SP" &&
      this.levelNum == 16 &&
      this.playerObject.gameDeaths == 0
    ) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 14));
    }
    this.deathScreens = 0;
    if (this.stage.quality === "HIGH") {
      this.morgue.addDeadBody(this.player, this.player.colour);
    }
    this.player.flowPoints = 0;
    this.player.burningFlow = false;
    this.skin.filters = new Array<any>();
    this.uiPanel.ping(this.camera, this.player);
    if (this.mode === "SP") {
      this.playerObject.gameDeaths++;
      this.startRewinding();
    } else if (this.mode === "MP" || this.mode === "PRACTICE") {
      this.logger.newLog();
      this.skin.visible = true;
      this.player.xVel = 0;
      this.player.yVel = 0;
      this.player.x = this.level.startPoint.x + 12.5;
      this.player.y = this.level.startPoint.y;
    }
  }

  public killS(): any {
    if (this.player.rewinding) {
      this.stopRewinding();
    }
    this.removeEventListener(lib.flash.events.Event.ENTER_FRAME, this.ping);
    this.removeEventListener(Relay.SEND, this.hub);
    this.removeEventListener(lib.flash.events.Event.ADDED_TO_STAGE, this.added);
    this.uiPanel.exitButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.exitOut
    );
    this.uiPanel.muteButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.muteOut
    );
    this.uiPanel.pauseButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.pauseOut
    );
    this.uiPanel.qualityButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.qualityOut
    );
    this.bg.kill();
    this.level?.kill();
    this.soundBackward?.stop();
    this.soundFast?.stop();
    this.soundForward?.stop();
  }

  public loadNextSinglePlayerLevel(): any {
    if (this.mode === "PRACTICE") {
      this.dispatchEvent(new Relay(Relay.GOTO, "Game", "EndPractice"));
      return;
    }

    var ra: number = NaN;
    this.levelNum++;
    this.chooseSong();
    this.playerObject.gameLevel = this.levelNum;
    if (this.levelNum != 0) {
      this.playerObject.gameTime = this.timer.getTimeAsTotalSeconds();
    }
    if (this.levelNum == 3) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 0));
      SoundBox.playSound("Cheer");
    }
    if (this.levelNum >= 4 && this.levelNum <= 9) {
      ra = Math2.random(10);
      if (ra == 1) {
        SoundBox.playSound("Cheer");
      } else {
        SoundBox.playSound("Cheer2");
      }
    }
    if (this.levelNum == 10) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 1));
      if (this.playerObject.gameDeaths == 0) {
        this.dispatchEvent(new AchEvent(AchEvent.SEND, 13));
      }
    }
    if (this.levelNum == 15) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 2));
    }
    if (this.levelNum == 20) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 3));
    }
    if (this.levelNum == 25) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 4));
    }
    if (this.levelNum == 30) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 5));
    }
    this.deathScreens++;
    if (this.deathScreens == 10) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 11));
    }
    if (this.levelNum == 31) {
      this.playerObject.gameLevel = 0;
      this.dispatchEvent(new Relay(Relay.GOTO, "Game", "End"));
      return;
    }
    this.uiPanel.levelNum = this.levelNum;
    this.player.levelNum = this.levelNum;
    this.createNewLevel();
    this.organizeDepth();
    this.addChild(this.fadeOut);
    this.fadeOut.x = 0 - this.x;
    this.fadeOut.y = 0 - this.y;
    this.skyLine.x = 0;
    this.skyLine.y = 0;
    this.dispatchEvent(new Relay(Relay.GOTO, "SaveGame"));
  }

  public muteOut(e: lib.flash.events.MouseEvent = null): any {
    SoundBox.handleMute();
  }

  public organizeDepth(): any {
    this.addChild(this.skyLine);
    if (this.levelNum <= 2) {
      this.skyLine.gotoAndStop(2);
    } else if (this.levelNum <= 9) {
      this.skyLine.gotoAndStop(3);
    } else if (this.levelNum == 10) {
      this.skyLine.gotoAndStop(2);
    } else if (this.levelNum <= 14) {
      this.skyLine.gotoAndStop(4);
    } else if (this.levelNum <= 16) {
      this.skyLine.gotoAndStop(2);
    } else if (this.levelNum <= 19) {
      this.skyLine.gotoAndStop(5);
    } else if (this.levelNum <= 24) {
      this.skyLine.gotoAndStop(6);
    } else if (this.levelNum <= 30) {
      this.skyLine.gotoAndStop(1);
    } else {
      this.skyLine.gotoAndStop(7);
    }
    this.addChild(this.level);
    this.addChild(this.bg);
    if (this.levelNum == 30) {
      this.bg.visible = false;
    }
    this.addChild(this.player);
    this.addChild(this.skin);
    this.addChild(this.skinLayer);
    this.addChild(this.morgue);
    this.addChild(this.uiPanel);
    this.addChild(this.emit);
    this.addChild(this.beam);
  }

  public pauseOut(e: lib.flash.events.MouseEvent = null): any {
    this.isPaused = !this.isPaused;
  }

  public ping(e: lib.flash.events.Event = null): any {
    if (this.level.colorBG != null) {
      Anim.colourMe(this.skyLine, this.level.colorBG);
    }
    if (this.isPaused && this.mode === "SP") {
      return;
    }
    this.tryFrame++;
    if (this.mode === "MP") {
      this.tUpdateFriendsENT();
    }
    this.endCountdown?.ping(-this.x, -this.y);
    if (!this.goAhead) {
      this.skin.x = this.player.x;
      this.skin.y = this.player.y;
      this.gotoAndStop(1);
      this.skin.fuel();
      return;
    }
    if (this.levelNum == 30 && !this.level30Okay) {
      this.skin.gotoAndStop(2);
      this.uiPanel.exitButton.visible = false;
      this.uiPanel.muteButton.visible = false;
      this.uiPanel.qualityButton.visible = false;
      this.uiPanel.pauseButton.visible = false;
      return;
    }

    const isPressingKill = Key.isDown(lib.flash.ui.Keyboard.K);
    if (
      isPressingKill &&
      !this.isPressingKill &&
      this.level.flags & LevelFlags.AllowSuicide
    ) {
      this.player.kill();
    }
    this.isPressingKill = isPressingKill;

    if (!this.player.rewinding) {
      this.player.ping();
      this.skin.ping();
      this.logger.ping(this.skin);
    } else {
      this.rewind();
    }
    this.handleCamera();
    this.handleLaserCannons();
    this.uiPanel.ping(this.camera, this.player);
    this.emit.ping();
    this.ghosting.ping(this.tryFrame);
    this.hotKeys();
    if (this.stage.quality === "HIGH") {
      this.bg.visible = true;
      this.bg.ping();
    } else {
      this.bg.visible = false;
    }
    this.morgue.ping();
    if (!this.levelFinished) {
      if (this.levelNum != 30) {
        this.timer.ping();
      }
    }
    if (this.levelNum != 30) {
      this.uiPanel.timeDisp.text = this.timer.getTimeAsString();
    } else {
      this.uiPanel.timeDisp.text = " ";
    }
    this.level.timeString = this.timer.getTimeAsString();
    if (this.levelNum == 30) {
      this.setRank();
    }
    this.level.setPlayer(this.player);
    this.level.ping();
    this.level.uniqueLevelPing();
    this.skyLine.ping();
    this.handleCheering();
    if (this.static) {
      this.static.x = 0 - this.x;
      this.static.y = 0 - this.y;
    }
    if (this.mode === "SP") {
      if (this.levelNum < 30) {
        if (
          this.player.hitTestObject(this.level["cautionSign"]) &&
          this.level["cautionSign"].visible
        ) {
          this.level["cautionSign"].visible = false;
          SoundBox.playSound("Scratcher");
          this.collectSign();
        }
      }
    }

    const isPressingPause = Key.isDown(lib.flash.ui.Keyboard.P);
    if (isPressingPause && this.mode !== "SP") {
      this.isPaused = !this.isPaused;
    }

    this.beam.x = this.skin.x;
    this.beam.y = this.skin.y;
    this.beam.visible = Beam.isVisible;
    const transform = new lib.flash.geom.ColorTransform();
    transform.alphaMultiplier = 0.5;
    transform.color = this.skin.colour;
    this.beam.transform.colorTransform = transform;
  }

  public qualityOut(e: lib.flash.events.MouseEvent = null): any {
    if (this.stage.quality == "LOW") {
      this.stage.quality = "HIGH";
      return;
    }
    if (this.stage.quality == "HIGH") {
      this.stage.quality = "LOW";
      return;
    }
  }

  public reset(): any {
    for (var i: number = 0; i < this.level.popSpikes.length; i++) {
      this.level.popSpikes[i].inside.gotoAndPlay(
        this.level.popSpikes[i].name.substr(1, 2)
      );
    }
    for (i = 0; i < this.level.swingingAxes.length; i++) {
      this.level.swingingAxes[i].axe.gotoAndPlay(
        this.level.swingingAxes[i].name.substr(1, 2)
      );
    }
  }

  public rewind(): any {
    var colourTransform: any = null;
    this.skin.visible = false;
    var flagForRewind: boolean = false;
    var rewindSpeed: any = 15;
    this.rewindCounter++;
    if (this.logger.playHead - rewindSpeed < 0) {
      rewindSpeed = Number(this.logger.playHead);
      flagForRewind = true;
    }
    for (var i: any = 0; i < rewindSpeed; i++) {
      this.logger.playHead--;
      this.logger.setFromLog(this.skin);
      this.player.x = this.skin.x;
      this.player.y = this.skin.y;
      this.skin.ping();
      if (!flagForRewind && this.skin.hitTestObject(this.level.startPoint)) {
        flagForRewind = true;
      }
      if (this.stage.quality === "HIGH") {
        colourTransform = new lib.flash.geom.ColorTransform();
        colourTransform.alphaMultiplier = 0.2;
        this.bg.drawMovieClip(this.skin, 1, 2, 3, colourTransform, "normal");
      }
    }
    if (flagForRewind) {
      this.stopRewinding();
    }
  }

  public runTest(): void {
    var time: number = NaN;
    var i: number = 0;
    var totalTi: any = 0;
    for (var j: any = 0; j < 10; j++) {
      time = lib.flash.utils.getTimer();
      for (i = 0; i < 500; i++) {
        this.ping();
      }
      totalTi = Number(totalTi + (lib.flash.utils.getTimer() - time));
    }
  }

  public setLevel(): any {
    this.level = main().createLevel(this.levelNum);
    this.level.init();
    this.addChild(this.level);
    this.curLevel = this.level;
    this.morgue.init(this.level, this.bg);
    if (this.levelNum == 0) {
      this.playerObject.gameDeaths = 0;
    }
  }

  public setPlayerName(str: string): any {
    this.playerObject.gameName = str;
    this.player.gameName = str;
  }

  public setRank(): any {
    if (this.timer.getTimeAsTotalSeconds() > 1200) {
      this.level.timeRank = "TAKING MY TIME   ";
    } else if (this.timer.getTimeAsTotalSeconds() > 1000) {
      this.level.timeRank = "PRETTY FAIR JOB  ";
    } else if (this.timer.getTimeAsTotalSeconds() > 900) {
      this.level.timeRank = "PACING OKAY      ";
    } else if (this.timer.getTimeAsTotalSeconds() > 720) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.level.timeRank = "MAYBE A JOG      ";
    } else if (this.timer.getTimeAsTotalSeconds() > 540) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.level.timeRank = "POWERWALKER      ";
    } else if (this.timer.getTimeAsTotalSeconds() > 510) {
      this.level.timeRank = "FAIR PERFORMANCE ";
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
    } else if (this.timer.getTimeAsTotalSeconds() > 480) {
      this.level.timeRank = "MODERATE PACE    ";
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
    } else if (this.timer.getTimeAsTotalSeconds() > 450) {
      this.level.timeRank = "IMPRESSIVE TIME  ";
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
    } else if (this.timer.getTimeAsTotalSeconds() > 420) {
      this.level.timeRank = "FAIRLY QUICK     ";
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
    } else if (this.timer.getTimeAsTotalSeconds() > 390) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 23));
      this.level.timeRank = "ZIPPING AROUND   ";
    } else if (this.timer.getTimeAsTotalSeconds() > 360) {
      this.level.timeRank = "ZOOM ZOOM ZOOMER ";
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 23));
    } else if (this.timer.getTimeAsTotalSeconds() > 330) {
      this.level.timeRank = "WICKED FAST PACE ";
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 23));
    } else {
      this.level.timeRank = "TOP RANKING RUN  ";
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 20));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 21));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 22));
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 23));
    }
  }

  public startBurningFlowMusic(): any {
    this.soundFast = this.sFast.play(this.soundForward.position, 1);
    this.soundFast.addEventListener(
      lib.flash.events.Event.SOUND_COMPLETE,
      this.endSoundFast
    );
    this.soundForward.removeEventListener(
      lib.flash.events.Event.SOUND_COMPLETE,
      this.endSoundForward
    );
    this.soundForward.stop();
    this.fastSound = true;
  }

  public startFinal(): any {
    if (this.songPlaying == "final") {
      return;
    }
    SoundBox.stopAllSounds();
    this.songPlaying = "final";
    this.sForward = new FinalA();
    this.sBackward = new FinalC();
    this.sFast = new FinalB();
    this.initSounds();
    this.startForwardMusic();
  }

  public startForwardMusic(): any {
    var soundPos: number = 0;
    this.fastSound = false;
    if (this.firstSoundPlay) {
      this.firstSoundPlay = false;
      this.soundForward = this.sForward.play(0, 1);
      this.soundForward.addEventListener(
        lib.flash.events.Event.SOUND_COMPLETE,
        this.endSoundForward
      );
    } else {
      soundPos = lib.__internal.avm2.Runtime.int(
        (this.sBackward.length - this.soundBackward.position) * this.soundRatio
      );
      SoundBox.stopAllSounds();
      if (soundPos < this.sForward.length && soundPos > 0) {
        this.soundForward = this.sForward.play(soundPos, 1);
      } else {
        this.soundForward = this.sForward.play(0, 1);
      }
      this.soundForward.addEventListener(
        lib.flash.events.Event.SOUND_COMPLETE,
        this.endSoundForward
      );
      this.soundBackward.removeEventListener(
        lib.flash.events.Event.SOUND_COMPLETE,
        this.endSoundBackward
      );
      this.soundBackward.stop();
    }
  }

  public startInside(): any {
    if (this.songPlaying == "inside") {
      return;
    }
    SoundBox.stopAllSounds();
    this.songPlaying = "inside";
    this.sForward = new InsideA();
    this.sBackward = new InsideC();
    this.sFast = new InsideB();
    this.initSounds();
    this.startForwardMusic();
  }

  public startLab(): any {
    if (this.songPlaying == "lab") {
      return;
    }
    SoundBox.stopAllSounds();
    this.songPlaying = "lab";
    this.sForward = new LabA();
    this.sBackward = new LabC();
    this.sFast = new LabB();
    this.initSounds();
    this.startForwardMusic();
  }

  public startLevel(): any {
    this.level.generateLevel();
    this.logger.newLog();
    this.ghosting.reset();
    this.startPlayer(this.player);
    this.player.xVel = 0;
    this.player.yVel = 0;
    this.tryFrame = 0;
    this.player.completedLevel = false;
    this.uiPanel.levelNum = this.levelNum;
    this.player.levelNum = this.levelNum;
    if (this.levelNum != 30) {
      this.uiPanel.levDisplay.text = "Stage " + (this.levelNum + 1);
    } else {
      this.uiPanel.levDisplay.text = "Ending";
    }
    if (this.levelNum <= 2) {
      this.uiPanel.levName.text = "Getting Out";
    } else if (this.levelNum <= 9) {
      this.uiPanel.levName.text = "The Stadium";
    } else if (this.levelNum <= 10) {
      this.uiPanel.levName.text = "The Audit";
    } else if (this.levelNum <= 14) {
      this.uiPanel.levName.text = "Lab Testing";
    } else if (this.levelNum <= 16) {
      this.uiPanel.levName.text = "The Path to Freedom";
    } else if (this.levelNum <= 19) {
      this.uiPanel.levName.text = "Backrooms";
    } else if (this.levelNum <= 24) {
      this.uiPanel.levName.text = "Outside";
    } else if (this.levelNum <= 32) {
      this.uiPanel.levName.text = "Skyline City Limits";
    } else if (this.levelNum <= 100) {
      this.uiPanel.levName.text = "Marathon";
    } else if (this.levelNum <= 101) {
      this.uiPanel.levName.text = "Front Door";
    } else if (this.levelNum <= 102) {
      this.uiPanel.levName.text = "Crossroads";
    } else if (this.levelNum <= 103) {
      this.uiPanel.levName.text = "Tubes";
    } else if (this.levelNum <= 104) {
      this.uiPanel.levName.text = "Death Wall";
    } else if (this.levelNum <= 105) {
      this.uiPanel.levName.text = "The Maze";
    } else if (this.levelNum <= 106) {
      this.uiPanel.levName.text = "Lunge";
    } else if (this.levelNum <= 107) {
      this.uiPanel.levName.text = "Unfriendly Teleporters";
    } else if (this.levelNum <= 108) {
      this.uiPanel.levName.text = "Funk";
    } else if (this.levelNum <= 109) {
      this.uiPanel.levName.text = "Cubicles";
    } else if (this.levelNum <= 110) {
      this.uiPanel.levName.text = "Over and Under";
    } else if (this.levelNum <= 111) {
      this.uiPanel.levName.text = "Zipper";
    } else if (this.levelNum <= 112) {
      this.uiPanel.levName.text = "Jumper";
    } else if (this.levelNum <= 113) {
      this.uiPanel.levName.text = "Slip and Slide";
    } else if (this.levelNum <= 114) {
      this.uiPanel.levName.text = "Wombat";
    } else if (this.levelNum <= 115) {
      this.uiPanel.levName.text = "Fuzz Balls";
    } else if (this.levelNum <= 116) {
      this.uiPanel.levName.text = "Secret Staircase";
    } else if (this.levelNum <= 117) {
      this.uiPanel.levName.text = "Cubey";
    } else if (this.levelNum <= 118) {
      this.uiPanel.levName.text = "Descending";
    } else if (this.levelNum <= 119) {
      this.uiPanel.levName.text = "Treadmillvania";
    } else {
      this.uiPanel.levName.text = this.level.name;
    }
    this.updateUISign();
    this.reset();
    if (this.mode === "MP") {
      this.tConnected = true;
    }
    this.organizeDepth();

    this.camera.limits = [
      400,
      this.level.maxWidth - 375,
      250,
      this.level.maxHeight < 225 ? 225 : this.level.maxHeight - 225,
    ];
    this.camera.move(this.player.x, this.player.y, false);
  }

  public startPlayer(mc: lib.flash.display.MovieClip): any {
    if (mc == this.player) {
      mc.x = this.level.startPoint.x + 12.5;
      mc.y = this.level.startPoint.y;
    } else {
      mc.x = this.level.startPoint.x + 12.5;
      mc.y = this.level.startPoint.y;
    }
    var startBeam: StartBeam = new StartBeam();
    this.addChild(startBeam);
    startBeam.x = this.level.startPoint.x;
    startBeam.y = this.level.startPoint.y;
    this.emit.manage(startBeam);
  }

  public startReverseMusic(): any {
    if (this.fastSound) {
      this.soundBackward = this.sBackward.play(
        (this.sForward.length - this.soundFast.position) / this.soundRatio,
        1
      );
      this.soundBackward.addEventListener(
        lib.flash.events.Event.SOUND_COMPLETE,
        this.endSoundBackward
      );
      this.soundFast.removeEventListener(
        lib.flash.events.Event.SOUND_COMPLETE,
        this.endSoundFast
      );
      this.soundFast.stop();
      this.fastSound = false;
    } else {
      this.soundBackward = this.sBackward.play(
        (this.sForward.length - this.soundForward.position) / this.soundRatio,
        1
      );
      this.soundBackward.addEventListener(
        lib.flash.events.Event.SOUND_COMPLETE,
        this.endSoundBackward
      );
      this.soundForward.removeEventListener(
        lib.flash.events.Event.SOUND_COMPLETE,
        this.endSoundForward
      );
      this.soundForward.stop();
    }
  }

  public startRewinding(): any {
    this.player.rewinding = true;
    this.startReverseMusic();
    this.dispatchEvent(new Relay(Relay.SEND, "StartJitter", "StartJitter"));
    this.static = new Static();
    this.addChild(this.static);
  }

  public startSinglePlayer(): any {
    this.goAhead = true;
  }

  public startSkyline(): any {
    if (this.songPlaying == "skyline") {
      return;
    }
    SoundBox.stopAllSounds();
    this.songPlaying = "skyline";
    this.sForward = new SkylineA();
    this.sBackward = new SkylineC();
    this.sFast = new SkylineB();
    this.initSounds();
    this.startForwardMusic();
  }

  public startStadium(): any {
    if (this.songPlaying == "stadium") {
      return;
    }
    SoundBox.stopAllSounds();
    this.songPlaying = "stadium";
    this.sForward = new StadiumA();
    this.sBackward = new StadiumC();
    this.sFast = new StadiumB();
    this.initSounds();
    this.startForwardMusic();
  }

  public stopBurningFlowMusic(): any {
    this.soundForward = this.sForward.play(this.soundFast.position, 1);
    this.soundForward.addEventListener(
      lib.flash.events.Event.SOUND_COMPLETE,
      this.endSoundForward
    );
    this.soundFast.removeEventListener(
      lib.flash.events.Event.SOUND_COMPLETE,
      this.endSoundFast
    );
    this.soundFast.stop();
    this.fastSound = false;
  }

  public stopRewinding(): any {
    this.player.rewinding = false;
    this.logger.newLog();
    this.skin.visible = true;
    this.player.xVel = 0;
    this.player.yVel = 0;
    this.player.x = this.level.startPoint.x + 12.5;
    this.player.y = this.level.startPoint.y;
    this.dispatchEvent(new Relay(Relay.SEND, "EndJitter", "EndJitter"));
    this.removeChild(this.static);
    this.static = null;
    if (this.rewindCounter > 150) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 12));
    }
    this.startForwardMusic();
  }

  public tCheck(id: number, checkpointID: number): any {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        this.playerSkins[i].addCheckPoint(checkpointID);
        return;
      }
    }
  }

  public tMarkTime(plyr: Player, str: any): any {
    plyr.completedLevel = true;
    plyr.time = Number(str);
  }

  public tRemovePlayer(id: number): any {
    var j: any = undefined;
    for (var i: any = 0; i < this.players.length; i++) {
      if (this.players[i].id == id) {
        for (j = 0; j < this.youArrows.length; j++) {
          if (this.youArrows[j].skin == this.playerSkins[i]) {
            this.removeChild(this.youArrows[j]);
            this.youArrows[j] = null;
            this.youArrows.splice(j, 1);
          }
        }
        this.skinLayer.removeChild(this.playerSkins[i]);
        this.playerSkins[i] = null;
        this.playerSkins.splice(i, 1);
        return;
      }
    }
  }

  public tSortTimes(): any {
    var nextToGo: any = null;
    var arrIndex: any = NaN;
    var tempArray: any[] = new Array<any>();
    this.finalPlacingArray.splice(0, this.finalPlacingArray.length);
    for (var i: any = 0; i < this.playerBars.length; i++) {
      tempArray.push(this.playerBars[i]);
    }
    while (tempArray.length > 0) {
      nextToGo = tempArray[0];
      arrIndex = 0;
      for (i = 0; i < tempArray.length; i++) {
        if (nextToGo.timeTotal > tempArray[i].timeTotal) {
          nextToGo = tempArray[i];
          arrIndex = Number(i);
        }
      }
      this.finalPlacingArray.push(nextToGo);
      tempArray.splice(arrIndex, 1);
    }
    for (i = 0; i < this.finalPlacingArray.length; i++) {
      this.finalPlacingArray[i].y = 180 + i * 36;
      this.finalPlacingArray[i].timeOf.text = this.timer.getRealTime(
        this.finalPlacingArray[i].timeTotal
      );
      this.finalPlacingArray[i].posOf.text = String(i + 1);
    }
    if (!this.endCountdown) {
      this.endCountdown = new EndCountdown(this.playerBars[0].player.userName);
      this.addChild(this.endCountdown);
    }
    if (this.finalPlacingArray.length == this.players.length) {
      if (!this.endCountdown) {
        this.endCountdown = new EndCountdown(
          this.playerBars[0].player.userName
        );
        this.addChild(this.endCountdown);
      }
    }
  }

  public tUpdateFriendsENT(): any {
    var j: any = NaN;
    var position: any = 1;
    for (var i: any = 0; i < this.playerSkins.length; i++) {
      if (!this.players[i].isPlayer) {
        this.players[i].tCounter++;
        if (this.players[i].tCounter > this.players[i].tCounterGoal) {
          this.playerSkins[i].x = this.players[i].xPos;
          this.playerSkins[i].y = this.players[i].yPos;
        } else {
          this.playerSkins[i].x =
            this.players[i].oldX +
            this.players[i].xV * this.players[i].tCounter;
          this.playerSkins[i].y =
            this.players[i].oldY +
            this.players[i].yV * this.players[i].tCounter;
        }
        this.playerSkins[i].colour = this.players[i].colour;
        this.playerSkins[i].colour2 = this.players[i].colour2;
        this.playerSkins[i].headType = this.players[i].headType;
        this.playerSkins[i].handType = this.players[i].handType;
        this.playerSkins[i].scaleX = this.players[i].xScale;
        this.playerSkins[i].gotoAndStop(this.players[i].fr);
        this.playerSkins[i].setColours();
        for (j = 0; j < this.curLevel.fallingSpikes.length; j++) {
          if (
            this.curLevel.fallingSpikes[j].rotation == 0 ||
            this.curLevel.fallingSpikes[j].rotation == 180
          ) {
            if (this.curLevel.fallingSpikes[j].smashState == 0) {
              if (
                Math.abs(
                  this.playerSkins[i].x - this.curLevel.fallingSpikes[j].x
                ) < 10
              ) {
                this.curLevel.fallingSpikes[j].smashState = 1;
              }
            }
          }
        }
        if (this.player.x < this.playerSkins[i].x) {
          position++;
        }
      } else {
        this.players[i].xPos = this.skin.x;
        this.players[i].yPos = this.skin.y;
        this.players[i].fr = this.skin.currentFrame;
        this.players[i].xScale = this.skin.scaleX;
      }
      for (j = 0; j < this.playerBars.length; j++) {
        if (this.playerBars[j].player == this.players[i]) {
          if (this.playerBars[j].timeTotal != this.players[i].time) {
            this.playerBars[j].timeTotal = this.players[i].time;
            this.tSortTimes();
          }
          break;
        }
      }
    }
    this.updatePlayerPosition(position);
    if (this.updateMethod == 1) {
      for (i = 0; i < this.robots.length; i++) {}
    }
    this.handleYouArrows();
  }

  public updatePing(num: number): any {}

  public updatePlayerPosition(num: number): any {
    if (!this.levelFinished) {
      this.uiPanel.placing.positionNum.text = String(num);
      if (num == 1) {
        this.uiPanel.placing.nth.text = "st";
      } else if (num == 2) {
        this.uiPanel.placing.nth.text = "nd";
      } else if (num == 3) {
        this.uiPanel.placing.nth.text = "rd";
      } else {
        this.uiPanel.placing.nth.text = "th";
      }
      this.uiPanel.placing.totalPlayers.text =
        "of " + this.players.length + " runners";
    }
  }

  public updateUISign(): any {
    var totSigns: any = 0;
    for (var i: any = 0; i < this.playerObject.signs.length; i++) {
      if (this.playerObject.signs[i] == true) {
        totSigns++;
      }
    }
    this.uiPanel["caution"].signsTot.text = totSigns + "/30";
    if (this.mode === "SP") {
      if (this.playerObject.signs[this.levelNum]) {
        this.level["cautionSign"].visible = false;
        this.uiPanel["caution"].gotoAndStop(11);
      } else {
        this.uiPanel["caution"].gotoAndStop(1);
      }
    }
    if (this.mode !== "SP") {
      this.uiPanel["caution"].visible = false;
    }
  }
}
