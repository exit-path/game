import lib from "swf-lib";
import { CharacterSelection } from "./CharacterSelection";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import { MultiplayerMenu } from "./MultiplayerMenu";
import { PlayerObject } from "./PlayerObject";
import { QuickPlayLobby } from "./QuickPlayLobby";
import { SinglePlayerMenu } from "./SinglePlayerMenu";
import { Tubes } from "./Tubes";

export class Multiplayer extends lib.flash.display.MovieClip {
  public declare characterSelection: CharacterSelection;

  public declare game: Game;

  public declare isSinglePlayer: boolean;

  public declare levelNames: any[];

  public declare lobby: Lobby;

  public declare multiplayerMenu: MultiplayerMenu;

  public declare playerObject: PlayerObject;

  public declare quickPlayLobby: QuickPlayLobby;

  public declare ranks: any[];

  public declare singlePlayerMenu: SinglePlayerMenu;

  public declare tubes: Tubes;

  public declare xpBase: number;

  public declare xpLevels: number;

  public constructor() {
    super();
    this.isSinglePlayer = false;
    this.xpLevels = 41;
    this.xpBase = 125;
    this.ranks = new Array<any>();
    this.levelNames = new Array<any>(
      "Novice",
      "Walker",
      "Jogger",
      "Runner",
      "Sprinter",
      "Windwalker",
      "Speedrunner",
      "Marathoner",
      "Earthrunner",
      "Pacer",
      "Drifter",
      "Voyager",
      "Nimble",
      "Expeditive",
      "Quick",
      "Outlast",
      "Spring",
      "Survivor",
      "Swift",
      "Trekker",
      "Tour",
      "Grace",
      "Agility",
      "Fast",
      "Zoom",
      "Fervor",
      "Rush",
      "Fly",
      "Momentum",
      "Haste",
      "Fleetness",
      "Forge",
      "Drive",
      "Boost",
      "Velocity",
      "Swiftness",
      "Accelerator",
      "Impel",
      "Breakneck",
      "Run Master",
      "Grandmaster",
      "Grandmaster"
    );
  }

  public getLevelByXP(num: number): any {
    for (var i: any = 0; i < this.ranks.length; i++) {
      if (num < this.ranks[i]) {
        return i - 1;
      }
    }
    return this.ranks.length - 1;
  }

  public getRankByXP(num: number): any {
    for (var i: any = 0; i < this.ranks.length; i++) {
      if (num < this.ranks[i]) {
        return this.levelNames[i - 1];
      }
    }
    return this.levelNames[this.ranks.length - 1];
  }

  public getXPBetweenLevels(num: number): any {
    for (var i: any = 0; i < this.ranks.length; i++) {
      if (num < this.ranks[i]) {
        return this.ranks[i] - this.ranks[i - 1];
      }
    }
    return 99999999;
  }

  public gotRoomList(): any {}

  public init(playerOb: PlayerObject): any {
    lib.__internal.avm2.Runtime.trace("MP-> INIT");
    this.initRanks();
    this.playerObject = playerOb;
    this.multiplayerMenu = new MultiplayerMenu();
    this.addChild(this.multiplayerMenu);
    this.multiplayerMenu.init(this.playerObject);
    this.isSinglePlayer = true;
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.ping,
      false,
      0,
      true
    );
  }

  public init2(playerOb: any): any {
    this.playerObject = playerOb;
    this.singlePlayerMenu = new SinglePlayerMenu();
    this.addChild(this.singlePlayerMenu);
    this.singlePlayerMenu.init(this.playerObject);
    this.isSinglePlayer = false;
  }

  public initRanks(): any {
    for (var i: any = 0; i < this.xpLevels; i++) {
      if (i == 0) {
        this.ranks.push(0);
      } else {
        this.ranks.push(this.ranks[i - 1] + i * this.xpBase);
      }
    }
    this.ranks.push(this.ranks[this.ranks.length - 1]);
  }

  public ping(e: lib.flash.events.Event): any {
    if (this.game) {
      if (this.game.tConnected) {
        if (this.tubes) {
          this.tubes.ping();
        }
      }
    }
  }

  public quickJoinRoom(): any {
    this.startGame();
  }

  public rejoin(): any {
    this.step(3);
    lib.__internal.avm2.Runtime.trace("MP-> REJOIN");
    this.updateUserCount(this.tubes.getRoomCount(), this.tubes.getRoomMax());
  }

  public startGame(): any {}

  public startQPM(): any {
    this.tubes = new Tubes();
    this.tubes.init(this.playerObject);
    this.addChild(this.tubes);
  }

  public startRoom(): any {}

  public startSinglePlayer(): any {
    this.game = new Game();
    this.game.mode = "SP";
    this.isSinglePlayer = true;
    this.game.init(this.tubes, this.playerObject, this.playerObject.gameLevel);
    this.addChild(this.game);
    this.game.startSinglePlayer();
  }

  public step(num: number): any {
    lib.__internal.avm2.Runtime.trace("MP-> QP STEP", num);
    if (this.quickPlayLobby) {
      lib.__internal.avm2.Runtime.trace("MP-> QP STEP TRIGGER", num);
      this.quickPlayLobby.step = num;
    }
  }

  public updateUserCount(num: number, num2: number): any {
    lib.__internal.avm2.Runtime.trace("MP-> UPDATE USER", num, num2);
    if (this.quickPlayLobby) {
      this.quickPlayLobby.updateUserCount(num, num2);
    }
  }
}
