import lib from "swf-lib";
import { AGILogin } from "../AGILogin";
import { AGIntro } from "../AGIntro";
import { CharacterSelection } from "../CharacterSelection";
import { FlairMenu } from "../FlairMenu";
import { MainMenu } from "../MainMenu";
import { Multiplayer } from "../Multiplayer";
import { NotLoggedIn } from "../NotLoggedIn";
import { ParallaxScrollingBitmap } from "../ParallaxScrollingBitmap";
import { TimeOutWindow } from "../TimeOutWindow";
import { UIBackground } from "../UIBackground";
import { AchEvent } from "../AchEvent";
import { Achievement } from "../Achievement";
import { SoundBox } from "../john/SoundBox";
import { Math2 } from "../john/Math2";
import { Key } from "../john/Key";
import { Ach } from "../Ach";
import { Relay } from "../john/Relay";
import { Rewind } from "../Rewind";
import { Lobby } from "../Lobby";
import { QuickPlayLobby } from "../QuickPlayLobby";
import { MultiplayerMenu } from "../MultiplayerMenu";
import { SinglePlayerMenu } from "../SinglePlayerMenu";
import { Game } from "../Game";
import { PlayerObject } from "../PlayerObject";
import { Level } from "../Level";
import { LevelUser } from "../LevelUser";
import { Level as UserLevel } from "../../../shared/level";
import { ExternalEvent } from "../ExternalEvent";

export class MainTimeline extends lib.flash.display.MovieClip {
  public declare achievements: Ach[];

  public declare agDomain: boolean;

  public declare agi: any;

  public declare agi_url: string;

  public declare agiLogin: AGILogin;

  public declare agIntro: AGIntro;

  public declare animals: string[];

  public declare armorGamesLink: lib.flash.net.URLRequest;

  public declare bitmapData: lib.flash.display.BitmapData;

  public declare characterSelection: CharacterSelection;

  public declare charSelectFromMainMenu: boolean;

  public declare charSelectFromMulti: boolean;

  public declare clearBitmap: lib.flash.display.BitmapData;

  public declare currentDomain: string;

  public declare devKey: string;

  public declare domain: string;

  public declare domEnd: number;

  public declare exitPathLink: lib.flash.net.URLRequest;

  public declare facebookLink: lib.flash.net.URLRequest;

  public declare flairMenu: FlairMenu;

  public declare gameKey: string;

  public declare isHS: boolean;

  public declare isLoggedIn: boolean;

  public declare LastDot: number;

  public declare lastScore: number;

  public declare loader: lib.flash.display.Loader;

  public declare mainMenu: MainMenu;

  public declare multiplayer: Multiplayer;

  public declare myCountry: string;

  public declare notLoggedIn: NotLoggedIn;

  public declare peopleNames: string[];

  public declare playerObj: PlayerObject;

  public declare preloader: lib.flash.display.MovieClipT<{
    bar: lib.flash.display.MovieClipT<{
      bar: lib.flash.display.MovieClip;
    }>;
    l: lib.flash.text.TextField;
    muteButton: lib.flash.display.SimpleButton;
    playB: lib.flash.display.SimpleButton;
    agButton: lib.flash.display.SimpleButton;
  }>;

  public declare psb: ParallaxScrollingBitmap;

  public declare rewind: lib.flash.display.MovieClip;

  public declare savedGame: lib.flash.net.SharedObject;

  public declare singlePlayer: boolean;

  public declare timeOutWindow: TimeOutWindow;

  public declare titles: string[];

  public declare twitterLink: lib.flash.net.URLRequest;

  public declare uiBackground: UIBackground;

  public declare url: string;

  public declare urlEnd: number;

  public declare urlRequest: lib.flash.net.URLRequest;

  public declare urlStart: number;

  userLevel: UserLevel | null = null;

  public constructor() {
    super();
    this.addFrameScript(0, this.frame1, 1, this.frame2, 2, this.frame3);
  }

  public achCenter(e: AchEvent = null): any {
    var achieve: Achievement = null;
    if (this.achievements[e.achNum].got == false) {
      this.achievements[e.achNum].got = true;
      this.playerObj.achs[e.achNum] = true;
      achieve = new Achievement();
      this.addChild(achieve);
      SoundBox.playSound("AchSound");
      if (e.achNum >= 24) {
        achieve.ach.box.handGear.gotoAndStop(e.achNum - 23);
        achieve.ach.box.head.visible = false;
        achieve.ach.box.head2.visible = false;
      } else {
        achieve.ach.box.head.gotoAndStop(e.achNum + 1);
        achieve.ach.box.handGear.visible = false;
      }
      achieve.ach.achTitle.text = this.achievements[e.achNum].achName;
    }
  }

  public agiLoginPop(e: lib.flash.events.MouseEvent): any {
    if (this.agi) {
      this.agi.showLogin(this.loginPopCheck, this);
      this.agiLogin.hitA.removeEventListener(
        lib.flash.events.MouseEvent.CLICK,
        this.agiLoginPop
      );
    }
  }

  public checkDomain(): any {
    if (this.agDomain) {
      return true;
    }
    return false;
  }

  public closeHandler(): void {
    if (this.isHS) {
      if (this.multiplayer && this.contains(this.multiplayer)) {
        this.multiplayer.singlePlayerMenu.addListeners();
      }
      this.isHS = false;
    } else {
      this.isLoggedIn = this.agi.isLoggedIn();
      SoundBox.playSound("Cheer2");
      if (this.isLoggedIn) {
        this.loadGame();
      }
      this.agiLogin.hitA.addEventListener(
        lib.flash.events.MouseEvent.CLICK,
        this.agiLoginPop
      );
      this.fixUpAgiLogin();
    }
  }

  public deleteAllData(): any {
    var saveObj: any = new Object();
    this.savedGame.data.saveObj = saveObj;
    this.savedGame.data.hasSaved = false;
    this.savedGame.flush();
    this.loadGame();
    this.saveGame();
  }

  public endMenus(): any {
    this.endUIBackground();
    SoundBox.stopAllSounds();
    if (this.contains(this.agiLogin)) {
      this.removeChild(this.agiLogin);
    }
  }

  public endUIBackground(): any {
    this.removeChild(this.uiBackground);
    this.uiBackground = null;
    this.removeEventListener(lib.flash.events.Event.ENTER_FRAME, this.uiBG);
  }

  public fixUpAgiLogin(): any {
    if (!this.agiLogin) {
      return;
    }
    if (!this.contains(this.agiLogin)) {
      return;
    }
    if (this.isLoggedIn) {
      this.agiLogin.disp.htmlText =
        "You are logged in as <FONT COLOR='#" +
        Math2.toHex(this.playerObj.colour) +
        "'>" +
        this.playerObj.userName +
        "</FONT>! [Click to Logout]";
    } else {
      this.agiLogin.disp.htmlText =
        "You are currently not logged in [Click to Login]";
    }
  }

  public frame1(): any {
    this.addEventListener(lib.flash.events.Event.ENTER_FRAME, this.preload);
    this.preloader.muteButton.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.muteOut,
      false,
      0,
      true
    );
    this.stop();
    this.url = this.stage.loaderInfo.url;
    this.urlStart = this.url.indexOf("://") + 3;
    this.urlEnd = this.url.indexOf("/", this.urlStart);
    this.domain = this.url.substring(this.urlStart, this.urlEnd);
    this.LastDot = this.domain.lastIndexOf(".") - 1;
    this.domEnd = this.domain.lastIndexOf(".", this.LastDot) + 1;
    this.domain = this.domain.substring(this.domEnd, this.domain.length);
    this.currentDomain = this.domain;
    this.agDomain = true;
  }

  public frame2(): any {
    this.play();
  }

  public frame3(): any {
    Key.initialize(this.stage, true);
    this.stop();
    this.myCountry = "Other";
    this.achievements = new Array<Ach>();
    this.achievements.push(
      new Ach("Underground", "Finish the underground portion")
    );
    this.achievements.push(new Ach("Stadium", "Finish the stadium portion"));
    this.achievements.push(new Ach("Lab", "Complete the lab stages"));
    this.achievements.push(new Ach("Outside", "Complete the escape sequence"));
    this.achievements.push(new Ach("Bridge", "Complete the bridge"));
    this.achievements.push(new Ach("Limits", "Reach the city limits and win"));
    this.achievements.push(new Ach("Jump", "Jump 1,000 times"));
    this.achievements.push(new Ach("Fill", "Fill FLOW to maximum"));
    this.achievements.push(new Ach("Burn", "Burn a full FLOW bar"));
    this.achievements.push(new Ach("Slide", "Slide for more than 8 blocks"));
    this.achievements.push(new Ach("Bounce", "Bounce 10 times on a platform"));
    this.achievements.push(new Ach("Survive", "Go 10 screens without dying"));
    this.achievements.push(new Ach("Rewind", "Rewind for more than 5 seconds"));
    this.achievements.push(new Ach("Freewind", "Don't die before level 11"));
    this.achievements.push(
      new Ach(
        "Mindwind",
        "Don't die before the extermination room level 16, then die"
      )
    );
    this.achievements.push(new Ach("Signage", "Collect a caution sign"));
    this.achievements.push(
      new Ach("SignEight", "Collect 25% of caution signs")
    );
    this.achievements.push(
      new Ach("SignFifteen", "Collect 50% of caution signs")
    );
    this.achievements.push(
      new Ach("SignTwentyFour", "Collect 75% of caution signs")
    );
    this.achievements.push(new Ach("SignAll", "Collect all caution signs"));
    this.achievements.push(new Ach("Fast", "Beat single player in 15 minutes"));
    this.achievements.push(
      new Ach("Faster", "Beat single player in 12 minutes")
    );
    this.achievements.push(
      new Ach("Fastest", "Beat single player in 9 minutes")
    );
    this.achievements.push(
      new Ach("Perfect", "Beat single player in 7 minutes")
    );
    this.achievements.push(new Ach("First", "Win a multiplayer race"));
    this.achievements.push(new Ach("Ten", "Win ten races"));
    this.achievements.push(new Ach("Hundred", "Win one hundred races"));
    this.achievements.push(new Ach("Kudomonger", "Earn 10 kudos"));
    this.achievements.push(new Ach("Kudomonster", "Earn 100 kudos"));
    this.achievements.push(new Ach("Kudomaster", "Earn 250 kudos"));
    this.achievements.push(new Ach("Matched", "Run 5 Races"));
    this.achievements.push(new Ach("Matchy", "Run 25 Races"));
    this.achievements.push(new Ach("Matchier", "Run 100 Races"));
    this.achievements.push(new Ach("Matchiest", "Run 250 Races"));
    this.achievements.push(new Ach("Reel", "Earn 5 kudos in one race"));
    this.achievements.push(new Ach("Rack", "Earn 7 kudos in one race"));
    this.achievements.push(new Ach("Runner", "Reach Level 3"));
    this.achievements.push(new Ach("Windwalker", "Reach Level 5"));
    this.achievements.push(new Ach("Earthrunner", "Reach Level 8"));
    this.achievements.push(new Ach("Drifter", "Reach Level 10"));
    this.achievements.push(new Ach("Outlast", "Reach Level 15"));
    this.achievements.push(new Ach("Tour", "Reach Level 20"));
    this.achievements.push(new Ach("Fervor", "Reach Level 25"));
    this.achievements.push(new Ach("Fleetness", "Reach Level 30"));
    this.achievements.push(new Ach("Swiftness", "Reach Level 35"));
    this.achievements.push(new Ach("Breakneck", "Reach Level 38"));
    this.achievements.push(new Ach("Runmaster", "Reach Level 39"));
    this.achievements.push(new Ach("Grandmaster", "Reach Level 40"));
    this.peopleNames = new Array<string>(
      "John",
      "Tony",
      "Dan",
      "Fil",
      "Ian",
      "Mike",
      "Larry",
      "Krin",
      "Con",
      "Louissi",
      "Justin"
    );
    this.titles = new Array<string>(
      "Rifle",
      "Cannon",
      "Frostbite",
      "Wolf",
      "Claws",
      "Saw",
      "Shock"
    );
    this.animals = new Array<any>(
      "Donkey",
      "Llama",
      "Platypus",
      "Hedgehog",
      "Giraffe",
      "Velociraptor",
      "Otter",
      "Hippo",
      "Elephant",
      "Kangaroo",
      "Marmot",
      "Falcon",
      "Tiger",
      "Cheetah",
      "Muskrat",
      "Deer",
      "Badger",
      "Lemur",
      "Possum",
      "Wildebeest",
      "Whale",
      "Dolphin",
      "Swordfish"
    );
    this.playerObj = new PlayerObject();
    this.playerObj.ping = 0;
    this.savedGame = lib.flash.net.SharedObject.getLocal("Exit-Path");
    this.loadGame();
    this.saveGame();
    this.isLoggedIn = false;
    this.multiplayer = new Multiplayer();
    this.singlePlayer = true;
    this.agIntro = new AGIntro();
    this.addChild(this.agIntro);
    this.agiLogin = new AGILogin();
    this.agiLogin.hitA.addEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.agiLoginPop
    );
    this.charSelectFromMainMenu = false;
    this.charSelectFromMulti = true;
    this.twitterLink = new lib.flash.net.URLRequest(
      "http://twitter.com/armorgames/"
    );
    this.armorGamesLink = new lib.flash.net.URLRequest(
      "http://armorgames.com/"
    );
    this.exitPathLink = new lib.flash.net.URLRequest(
      "http://armorgames.com/play/5917/exit-path"
    );
    this.facebookLink = new lib.flash.net.URLRequest(
      "http://www.facebook.com/pages/Armor-Games/19522089061"
    );
    this.addEventListener(Relay.GOTO, this.hub, false, 0, true);
    this.addEventListener(Relay.SEND, this.messageCenter, false, 0, true);
    this.addEventListener(AchEvent.SEND, this.achCenter, false, 0, true);
    this.bitmapData = new lib.flash.display.BitmapData(800, 500);
    this.bitmapData.draw(this.multiplayer, null, null, null);
    this.rewind = new Rewind();
    this.psb = new ParallaxScrollingBitmap(this.bitmapData, 500, 800);
    this.clearBitmap = new lib.flash.display.BitmapData(800, 500, true, 0);
  }

  public getAGIName(): any {
    var tempPlayerObj: any = null;
    if (this.agi) {
      tempPlayerObj = this.agi.getUserProfile();
      return tempPlayerObj.username;
    }
    return this.getRandomName();
  }

  public getAGISaver(): any {
    if (this.agi && this.contains(this.agi)) {
    }
  }

  public getRandomName(): any {
    return (
      "Guest_" +
      this.animals[Math2.random(this.animals.length)] +
      Math2.random(100000)
    );
  }

  public highscoresHandler() {}

  public highscoreSub() {}

  public hub(e: Relay): any {
    var _loc2_: number = NaN;
    if (e.sender == "Twitter") {
      lib.flash.net.navigateToURL(this.twitterLink, "_blank");
    }
    if (e.sender == "Facebook") {
      lib.flash.net.navigateToURL(this.facebookLink, "_blank");
    }
    if (e.sender == "ArmorGames") {
      lib.flash.net.navigateToURL(this.armorGamesLink, "_blank");
    }
    if (e.sender == "ExitPathLink") {
      lib.flash.net.navigateToURL(this.exitPathLink, "_blank");
    }
    if (e.sender == "endIntro") {
      this.mainMenu = new MainMenu(this.agDomain);
      this.startMenus();
      this.addChild(this.mainMenu);
      this.startMainMenu();
      return;
    }
    if (e.sender == "SaveGame") {
      this.saveGame();
    }
    if (e.sender == "DeleteAllData") {
      this.deleteAllData();
    }
    if (e.sender == "LevelEnd") {
      this.multiplayer.game.removeChild(this.multiplayer.game.levelEnd);
      this.multiplayer.game.levelEnd = null;
      this.multiplayer.game.killS();
      this.multiplayer.removeChild(this.multiplayer.game);
      this.multiplayer.game = null;
      this.startLowMenu();
      this.multiplayer.lobby = new Lobby();
      this.multiplayer.addChild(this.multiplayer.lobby);
      this.multiplayer.lobby.init(this.multiplayer.tubes);
      this.multiplayer.tubes.locate = "Lobby";
      this.multiplayer.addChild(this.multiplayer.tubes);
    }
    if (e.sender == "MainMenu") {
      this.killAgiLogin();
      switch (e.msg) {
        case "Multiplayer":
          this.mainMenu.kill();
          this.removeChild(this.mainMenu);
          this.mainMenu = null;
          this.multiplayer = new Multiplayer();
          this.addChild(this.multiplayer);
          this.multiplayer.init(this.playerObj);
          if (!this.isLoggedIn) {
            this.notLoggedIn = new NotLoggedIn();
            this.addChild(this.notLoggedIn);
            this.notLoggedIn.init();
          }
          break;
        case "SinglePlayer":
          this.mainMenu.kill();
          this.removeChild(this.mainMenu);
          this.mainMenu = null;
          this.multiplayer = new Multiplayer();
          this.addChild(this.multiplayer);
          this.multiplayer.init2(this.playerObj);
          break;
        case "Flair":
          this.mainMenu.kill();
          this.removeChild(this.mainMenu);
          this.mainMenu = null;
          this.flairMenu = new FlairMenu();
          this.addChild(this.flairMenu);
          this.flairMenu.init(this.playerObj, this.achievements);
          break;
        case "CharacterEdit":
          this.mainMenu.kill();
          this.removeChild(this.mainMenu);
          this.mainMenu = null;
          this.characterSelection = new CharacterSelection(this.playerObj);
          this.addChild(this.characterSelection);
          this.charSelectFromMainMenu = true;
          this.dispatchEvent(
            new ExternalEvent({
              type: "modify-start",
            })
          );
      }
    }
    if (e.sender == "MultiplayerMenu") {
      switch (e.msg) {
        case "Back":
          this.multiplayer.multiplayerMenu.kill();
          this.multiplayer.removeChild(this.multiplayer.multiplayerMenu);
          this.multiplayer.multiplayerMenu = null;
          this.removeChild(this.multiplayer);
          this.multiplayer = null;
          this.mainMenu = new MainMenu(this.agDomain);
          this.addChild(this.mainMenu);
          this.startMainMenu();
          break;
        case "QuickPlay":
          this.multiplayer.multiplayerMenu.kill();
          this.multiplayer.removeChild(this.multiplayer.multiplayerMenu);
          this.multiplayer.multiplayerMenu = null;
          this.multiplayer.quickPlayLobby = new QuickPlayLobby();
          this.multiplayer.quickPlayLobby.init();
          this.multiplayer.addChild(this.multiplayer.quickPlayLobby);
          this.multiplayer.startQPM();
          this.startLowMenu();
          this.killAgiLogin();
          break;
        case "CharacterSelection":
          this.multiplayer.multiplayerMenu.kill();
          this.multiplayer.removeChild(this.multiplayer.multiplayerMenu);
          this.multiplayer.multiplayerMenu = null;
          this.multiplayer.characterSelection = new CharacterSelection(
            this.playerObj
          );
          this.multiplayer.addChild(this.multiplayer.characterSelection);
          this.charSelectFromMainMenu = false;
          this.charSelectFromMulti = true;
          this.dispatchEvent(
            new ExternalEvent({
              type: "modify-start",
            })
          );
      }
    }
    if (e.sender == "Tubes") {
      switch (e.msg) {
        case "TimeOut":
          SoundBox.stopAllSounds();
          switch (this.multiplayer.tubes.locate) {
            case "Lobby":
              this.multiplayer.removeChild(this.multiplayer.lobby);
              this.multiplayer.lobby.kill();
              this.multiplayer.lobby = null;
              break;
            case "Game":
              this.multiplayer.game.killS();
              this.multiplayer.removeChild(this.multiplayer.game);
              this.multiplayer.game = null;
              break;
            case "QPL":
              this.multiplayer.quickPlayLobby.kill();
              this.multiplayer.removeChild(this.multiplayer.quickPlayLobby);
              this.multiplayer.quickPlayLobby = null;
          }
          this.multiplayer.tubes.disconnect();
          this.multiplayer.removeChild(this.multiplayer.tubes);
          this.multiplayer.tubes = null;
          this.startMenus();
          this.addChild(this.multiplayer);
          this.multiplayer.multiplayerMenu = new MultiplayerMenu();
          this.multiplayer.addChild(this.multiplayer.multiplayerMenu);
          this.multiplayer.multiplayerMenu.init(this.playerObj);
          this.timeOutWindow = new TimeOutWindow();
          this.addChild(this.timeOutWindow);
          this.timeOutWindow.init();
      }
    }
    if (e.sender == "FlairMenu") {
      switch (e.msg) {
        case "Back":
          this.flairMenu.kill();
          this.removeChild(this.flairMenu);
          this.flairMenu = null;
          this.mainMenu = new MainMenu(this.agDomain);
          this.addChild(this.mainMenu);
          this.startMainMenu();
      }
    }
    if (e.sender == "SinglePlayerMenu") {
      switch (e.msg) {
        case "BackButton":
          this.multiplayer.singlePlayerMenu.kill();
          this.multiplayer.removeChild(this.multiplayer.singlePlayerMenu);
          this.multiplayer.singlePlayerMenu = null;
          this.removeChild(this.multiplayer);
          this.multiplayer = null;
          this.mainMenu = new MainMenu(this.agDomain);
          this.addChild(this.mainMenu);
          this.startMainMenu();
          break;
        case "Delete":
          this.playerObj.gameLevel = 0;
          this.playerObj.gameTime = 0;
          this.playerObj.gameDeaths = 0;
          this.multiplayer.singlePlayerMenu.kill();
          this.multiplayer.singlePlayerMenu.init(this.playerObj);
          break;
        case "StartGame":
          this.endMenus();
          this.multiplayer.singlePlayerMenu.kill();
          this.multiplayer.removeChild(this.multiplayer.singlePlayerMenu);
          this.multiplayer.singlePlayerMenu = null;
          this.multiplayer.startSinglePlayer();
          break;
        case "ViewHighscores":
          this.highscoresHandler();
          break;
        case "CharacterSelection":
          this.multiplayer.singlePlayerMenu.kill();
          this.multiplayer.removeChild(this.multiplayer.singlePlayerMenu);
          this.multiplayer.singlePlayerMenu = null;
          this.multiplayer.characterSelection = new CharacterSelection(
            this.playerObj
          );
          this.multiplayer.addChild(this.multiplayer.characterSelection);
          this.charSelectFromMainMenu = false;
          this.charSelectFromMulti = false;
          this.dispatchEvent(
            new ExternalEvent({
              type: "modify-start",
            })
          );
      }
    }
    if (e.sender == "CharacterSelection") {
      switch (e.msg) {
        case "Back":
          if (this.charSelectFromMainMenu) {
            this.characterSelection.kill();
            this.removeChild(this.characterSelection);
            this.characterSelection = null;
            this.mainMenu = new MainMenu(this.agDomain);
            this.addChild(this.mainMenu);
            this.startMainMenu();
            return;
          }
          this.multiplayer.characterSelection.kill();
          this.multiplayer.removeChild(this.multiplayer.characterSelection);
          this.multiplayer.characterSelection = null;
          if (this.charSelectFromMulti) {
            this.multiplayer.multiplayerMenu = new MultiplayerMenu();
            this.multiplayer.addChild(this.multiplayer.multiplayerMenu);
            this.multiplayer.multiplayerMenu.init(this.playerObj);
          } else {
            this.multiplayer.singlePlayerMenu = new SinglePlayerMenu();
            this.multiplayer.addChild(this.multiplayer.singlePlayerMenu);
            this.multiplayer.singlePlayerMenu.init(this.playerObj);
          }
          break;
      }
    }
    if (e.sender == "QuickPlayLobby") {
      switch (e.msg) {
        case "Back":
          this.multiplayer.quickPlayLobby.kill();
          this.multiplayer.removeChild(this.multiplayer.quickPlayLobby);
          this.multiplayer.quickPlayLobby = null;
          this.multiplayer.multiplayerMenu = new MultiplayerMenu();
          this.multiplayer.addChild(this.multiplayer.multiplayerMenu);
          this.multiplayer.multiplayerMenu.init(this.playerObj);
          this.startMenus();
          this.addChild(this.multiplayer);
          this.multiplayer.tubes.disconnect();
          this.multiplayer.removeChild(this.multiplayer.tubes);
          this.multiplayer.tubes = null;
          break;
        case "StartGame":
          this.endMenus();
          this.multiplayer.quickPlayLobby.kill();
          this.multiplayer.removeChild(this.multiplayer.quickPlayLobby);
          this.multiplayer.quickPlayLobby = null;
          this.multiplayer.tubes.locate = "Game";
          this.multiplayer.game = new Game();
          this.multiplayer.game.mode = "MP";
          this.multiplayer.addChild(this.multiplayer.game);
          this.multiplayer.game.init(
            this.multiplayer.tubes,
            this.playerObj,
            this.multiplayer.tubes.room.nextLevel
          );
          this.multiplayer.game.countdownStart();
          this.multiplayer.addChild(this.multiplayer.tubes);
          this.multiplayer.game.initMP();
          break;
        case "OpenLobby":
          this.endUIBackground();
          this.multiplayer.quickPlayLobby.kill();
          this.multiplayer.removeChild(this.multiplayer.quickPlayLobby);
          this.multiplayer.quickPlayLobby = null;
          this.multiplayer.lobby = new Lobby();
          this.multiplayer.addChild(this.multiplayer.lobby);
          this.multiplayer.lobby.init(this.multiplayer.tubes);
          this.multiplayer.tubes.locate = "Lobby";
          this.multiplayer.addChild(this.multiplayer.tubes);
      }
    }
    if (e.sender == "Lobby") {
      switch (e.msg) {
        case "Back":
          this.multiplayer.removeChild(this.multiplayer.lobby);
          this.multiplayer.lobby.kill();
          this.multiplayer.lobby = null;
          this.multiplayer.tubes.disconnect();
          this.multiplayer.removeChild(this.multiplayer.tubes);
          this.multiplayer.tubes = null;
          this.startMenus();
          this.addChild(this.multiplayer);
          this.multiplayer.multiplayerMenu = new MultiplayerMenu();
          this.multiplayer.addChild(this.multiplayer.multiplayerMenu);
          this.multiplayer.multiplayerMenu.init(this.playerObj);
          break;
        case "StartGame":
          this.multiplayer.tubes.locate = "Game";
          if (this.multiplayer.contains(this.multiplayer.lobby)) {
            this.multiplayer.removeChild(this.multiplayer.lobby);
            this.multiplayer.lobby.kill();
          }
          this.multiplayer.lobby = null;
          this.multiplayer.game = new Game();
          this.multiplayer.game.mode = "MP";
          this.multiplayer.addChild(this.multiplayer.game);
          this.multiplayer.game.init(
            this.multiplayer.tubes,
            this.playerObj,
            this.multiplayer.tubes.room.nextLevel
          );
          this.multiplayer.game.countdownStart();
          this.multiplayer.addChild(this.multiplayer.tubes);
          this.multiplayer.game.initMP();
      }
    }
    if (e.sender == "Game") {
      switch (e.msg) {
        case "SinglePlayerMenu":
          this.multiplayer.game.killS();
          this.multiplayer.removeChild(this.multiplayer.game);
          this.multiplayer.game = null;
          this.startMenus();
          this.addChild(this.multiplayer);
          this.multiplayer.singlePlayerMenu = new SinglePlayerMenu();
          this.multiplayer.addChild(this.multiplayer.singlePlayerMenu);
          this.multiplayer.singlePlayerMenu.init(this.playerObj);
          break;
        case "End":
          this.lastScore = this.multiplayer.game.timer.getTimeAsTotalSeconds();
          _loc2_ = this.multiplayer.game.timer.timerCounter;
          if (_loc2_ < this.playerObj.bestTime) {
            this.playerObj.bestTime = _loc2_;
          }
          this.multiplayer.game.endFadeOut();
          this.multiplayer.game.killS();
          this.multiplayer.removeChild(this.multiplayer.game);
          this.multiplayer.game = null;
          this.startMenus();
          this.addChild(this.multiplayer);
          this.multiplayer.singlePlayerMenu = new SinglePlayerMenu();
          this.multiplayer.addChild(this.multiplayer.singlePlayerMenu);
          this.multiplayer.singlePlayerMenu.init(this.playerObj);
          this.highscoreSub();
          this.saveGame();
          this.startLowMenu();
          break;
        case "EndPractice":
          this.multiplayer.game.endFadeOut();
          this.multiplayer.game.killS();
          this.multiplayer.removeChild(this.multiplayer.game);
          this.multiplayer.game = null;
          this.startMenus();
          this.addChild(this.multiplayer);
          this.multiplayer.singlePlayerMenu = new SinglePlayerMenu();
          this.multiplayer.addChild(this.multiplayer.singlePlayerMenu);
          this.multiplayer.singlePlayerMenu.init(this.playerObj);
          this.startLowMenu();
          break;
      }
    }
  }

  public killAch(mov: lib.flash.display.MovieClip): any {
    mov.stop();
    this.removeChild(mov);
    mov = null;
  }

  public killAgiLogin(): any {
    if (this.contains(this.agiLogin)) {
      this.removeChild(this.agiLogin);
    }
  }

  public killAGISaver(): any {
    if (this.agi && this.contains(this.agi)) {
    }
  }

  public loadGame(): any {
    if (this.isLoggedIn) {
      this.agi.retrieveUserData(this.yumyum);
      return;
    }
    if (
      this.savedGame.data.hasSaved == false ||
      this.savedGame.data.hasSaved == undefined
    ) {
      this.newGame();
    } else {
      this.loadGamez();
    }
  }

  public loadGamez(): any {
    this.playerObj.userName = String(
      this.savedGame.data.saveObj.userName ?? this.getRandomName()
    );
    this.playerObj.colour = Number(this.savedGame.data.saveObj.colour);
    this.playerObj.colour2 = Number(this.savedGame.data.saveObj.colour2);
    this.playerObj.headType = Number(this.savedGame.data.saveObj.headType);
    this.playerObj.handType = Number(this.savedGame.data.saveObj.handType);
    this.playerObj.xp = Number(this.savedGame.data.saveObj.xp);
    this.playerObj.kudos = Number(this.savedGame.data.saveObj.kudos);
    this.playerObj.matches = Number(this.savedGame.data.saveObj.matches);
    this.playerObj.wins = Number(this.savedGame.data.saveObj.wins);
    this.playerObj.jumps = Number(this.savedGame.data.saveObj.jumps);
    this.playerObj.deaths = Number(this.savedGame.data.saveObj.deaths);
    this.playerObj.gameDeaths = Number(this.savedGame.data.saveObj.gameDeaths);
    this.playerObj.gameLevel = Number(this.savedGame.data.saveObj.gameLevel);
    this.playerObj.gameTime = Number(this.savedGame.data.saveObj.gameTime);
    if (this.savedGame.data.saveObj.gameName == null) {
      this.playerObj.gameName = "01234567";
    } else {
      this.playerObj.gameName = String(this.savedGame.data.saveObj.gameName);
    }
    this.playerObj.bestTime = Number(this.savedGame.data.saveObj.bestTime);
    this.playerObj.signs = this.savedGame.data.saveObj.signs;
    this.playerObj.achs = this.savedGame.data.saveObj.achs;
    this.playerObj.ping = 0;
    for (var j: any = 0; j < this.playerObj.achs.length; j++) {
      this.achievements[j].got = this.playerObj.achs[j];
    }
  }

  public loginPopCheck(obj: any): any {
    if (obj.success) {
      this.playerObj.userName = obj.username;
      this.fixUpAgiLogin();
    }
  }

  public messageCenter(e: Relay): any {
    if (e.sender == "StartBox") {
      switch (e.msg) {
        case "go":
          this.multiplayer.game.countDownFinish();
      }
    }
    if (e.sender == "StartJitter") {
      this.addChild(this.psb);
      this.addChild(this.rewind);
      this.psb.cameraY = 0;
      this.addEventListener(lib.flash.events.Event.ENTER_FRAME, this.something);
    }
    if (e.sender == "EndJitter") {
      this.removeChild(this.rewind);
      this.removeChild(this.psb);
      this.removeEventListener(
        lib.flash.events.Event.ENTER_FRAME,
        this.something
      );
    }
  }

  public muteOut(e: lib.flash.events.MouseEvent = null): any {
    SoundBox.handleMute();
  }

  public newGame(): any {
    this.playerObj.userName = this.getRandomName();
    this.playerObj.colour = 3394815;
    this.playerObj.colour2 = 16777215;
    this.playerObj.headType = 1;
    this.playerObj.handType = 1;
    this.playerObj.xp = 0;
    this.playerObj.kudos = 0;
    this.playerObj.matches = 0;
    this.playerObj.wins = 0;
    this.playerObj.jumps = 0;
    this.playerObj.deaths = 0;
    this.playerObj.gameDeaths = 0;
    this.playerObj.gameLevel = 0;
    this.playerObj.gameTime = 0;
    this.playerObj.gameName = "01234567";
    this.playerObj.ping = 0;
    this.playerObj.bestTime = 9999999999;
    this.playerObj.signs = new Array<any>(
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    );
    this.playerObj.achs = new Array<any>(
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    );
  }

  public preload(event: lib.flash.events.Event): void {
    var Rbytestotal: any = this.stage.loaderInfo.bytesTotal;
    var Rbytesloaded: any = this.stage.loaderInfo.bytesLoaded;
    var m: number = (Rbytesloaded / Rbytestotal) * 100;
    this.preloader.l.text = "Loading... " + Math.floor(m) + "%";
    this.preloader.bar.bar.scaleX = m / 100;
    if (Rbytesloaded >= Rbytestotal) {
      this.preloader.bar.bar.scaleX = 1;
      this.removeEventListener(
        lib.flash.events.Event.ENTER_FRAME,
        this.preload
      );
      this.preloader.playB.addEventListener(
        lib.flash.events.MouseEvent.CLICK,
        this.startIt
      );
      this.preloader.playB.visible = true;
    } else {
      this.preloader.playB.visible = false;
    }
  }

  public saveGame(): any {
    var saveObj: any = new Object();
    saveObj.userName = String(this.playerObj.userName);
    saveObj.colour = String(this.playerObj.colour);
    saveObj.colour2 = String(this.playerObj.colour2);
    saveObj.headType = String(this.playerObj.headType);
    saveObj.handType = String(this.playerObj.handType);
    saveObj.xp = String(this.playerObj.xp);
    saveObj.kudos = String(this.playerObj.kudos);
    saveObj.matches = String(this.playerObj.matches);
    saveObj.wins = String(this.playerObj.wins);
    saveObj.jumps = String(this.playerObj.jumps);
    saveObj.deaths = String(this.playerObj.deaths);
    saveObj.gameDeaths = String(this.playerObj.gameDeaths);
    saveObj.gameLevel = String(this.playerObj.gameLevel);
    saveObj.gameName = String(this.playerObj.gameName);
    saveObj.gameTime = String(this.playerObj.gameTime);
    saveObj.bestTime = String(this.playerObj.bestTime);
    saveObj.signs = this.playerObj.signs;
    saveObj.achs = this.playerObj.achs;
    this.savedGame.data.hasSaved = true;
    this.savedGame.data.saveObj = saveObj;
    this.savedGame.flush();
    if (this.isLoggedIn) {
      this.agi.submitUserDataObject(saveObj);
    }
  }

  public something(e: lib.flash.events.Event = null): any {
    this.psb._texture.copyPixels(
      this.clearBitmap,
      this.clearBitmap.rect,
      new lib.flash.geom.Point()
    );
    this.psb._texture.draw(this.multiplayer, null, null, null);
    this.psb.render();
    this.psb.cameraY = this.psb.cameraY - (490 + Math2.random(20));
  }

  public startAGILogin(): any {
    if (this.checkDomain()) {
      this.addChild(this.agiLogin);
      this.fixUpAgiLogin();
    }
  }

  public startIt(e: lib.flash.events.MouseEvent): any {
    this.preloader.playB.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.startIt
    );
    this.preloader.muteButton.removeEventListener(
      lib.flash.events.MouseEvent.CLICK,
      this.muteOut
    );
    this.gotoAndStop("intro");
  }

  public startLowMenu(): any {
    SoundBox.stopAllSounds();
    SoundBox.loopSound("MenuLow");
  }

  public startMainMenu(): any {
    this.getAGISaver();
    this.startAGILogin();
  }

  public startMenus(): any {
    this.startUIBackground();
    SoundBox.stopAllSounds();
    SoundBox.loopSound("MainMenuSong");
  }

  public startUIBackground(): any {
    if (this.uiBackground) {
      this.removeChild(this.uiBackground);
    }
    this.uiBackground = new UIBackground();
    this.addChild(this.uiBackground);
    this.addEventListener(
      lib.flash.events.Event.ENTER_FRAME,
      this.uiBG,
      false,
      0,
      true
    );
  }

  public uiBG(e: lib.flash.events.Event): any {
    if (this.mainMenu) {
      this.uiBackground.ping();
    }
  }

  public yumyum(obj: any): any {
    var myObj: any = obj.data;
    if (myObj.colour == null) {
      this.saveGame();
      return;
    }
    this.playerObj.userName = this.getAGIName();
    this.playerObj.colour = Number(myObj.colour);
    this.playerObj.colour2 = Number(myObj.colour2);
    this.playerObj.headType = Number(myObj.headType);
    this.playerObj.handType = Number(myObj.handType);
    this.playerObj.xp = Number(myObj.xp);
    this.playerObj.kudos = Number(myObj.kudos);
    this.playerObj.matches = Number(myObj.matches);
    this.playerObj.wins = Number(myObj.wins);
    this.playerObj.jumps = Number(myObj.jumps);
    this.playerObj.deaths = Number(myObj.deaths);
    this.playerObj.gameDeaths = Number(myObj.gameDeaths);
    if (myObj.gameName == null) {
      this.playerObj.gameName = "01234567";
    } else {
      this.playerObj.gameName = String(myObj.gameName);
    }
    this.playerObj.gameLevel = Number(myObj.gameLevel);
    this.playerObj.gameTime = Number(myObj.gameTime);
    this.playerObj.bestTime = Number(myObj.bestTime);
    this.playerObj.ping = 0;
    this.playerObj.signs = myObj.signs;
    this.playerObj.achs = myObj.achs;
    for (var j: any = 0; j < this.playerObj.achs.length; j++) {
      this.achievements[j].got = this.playerObj.achs[j];
    }
  }

  public setUserLevel(level: UserLevel) {
    this.userLevel = level;
  }

  public startPracticeLevel(level: number) {
    this.endMenus();
    this.multiplayer.singlePlayerMenu.kill();
    this.multiplayer.removeChild(this.multiplayer.singlePlayerMenu);
    this.multiplayer.singlePlayerMenu = null;

    this.multiplayer.game = new Game();
    this.multiplayer.game.mode = "PRACTICE";
    this.multiplayer.addChild(this.multiplayer.game);
    this.multiplayer.game.init(null, this.playerObj, level);
    this.multiplayer.game.initPractice();
  }

  public createLevel(level: number): Level {
    if (level === 999 && this.userLevel) {
      return new LevelUser(this.userLevel);
    }

    const Level = lib.flash.utils.getDefinitionByName(
      `Level${level}`
    ) as new () => Level;
    return new Level();
  }
}
