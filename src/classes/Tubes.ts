import lib from "swf-lib";
import { PlayerShell } from "./PlayerShell";
import { SmartFoxClient } from "./it/gotoandplay/smartfoxserver/SmartFoxClient";
import { Math2 } from "./john/Math2";
import { SFSEvent } from "./it/gotoandplay/smartfoxserver/SFSEvent";
import { SoundBox } from "./john/SoundBox";
import { AchEvent } from "./AchEvent";
import { LevelUpWindow } from "./LevelUpWindow";
import { Relay } from "./john/Relay";
import { Key } from "./john/Key";

export class Tubes extends lib.flash.display.MovieClip {
  public declare allAlone: boolean;

  public declare allAloneCounter: number;

  public declare currentPing: number;

  public declare debuggy: lib.flash.display.MovieClip;

  public declare finalList: any[];

  public declare firstTimeIn: boolean;

  public declare firstTimeSend: boolean;

  public declare hostTimer: lib.flash.utils.Timer;

  public declare inLimbo: boolean;

  public declare levelStarted: boolean;

  public declare locate: string;

  private declare maxPlayers: number;

  private declare minPlayers: number;

  private declare mpLevels: any[];

  public declare muteList: any[];

  public declare myNextLevel: number;

  public declare readonly NEWLINE: string;

  public declare pingCount: number;

  public declare pingCounter: number;

  public declare player: PlayerShell;

  public declare playerObject: any;

  public declare players: any[];

  public declare sfs: SmartFoxClient;

  public declare startedGame: boolean;

  public declare tCounter: number;

  public declare tCounterGoal: number;

  public declare timeCounter: number;

  public declare timeOutCounter: number;

  public declare timer: lib.flash.utils.Timer;

  public declare timerUpdateRate: number;

  public declare timeToGo: number;

  public declare timeToGoCounter: number;

  public declare timeToGoStart: number;

  public declare totalPingTime: number;

  public declare updaters: any;

  public constructor() {
    super();
    this.minPlayers = 2;
    this.timeToGoStart = 25;
    this.startedGame = false;
    this.tCounterGoal = 6;
    this.pingCounter = 0;
    this.timeToGo = 25;
    this.allAlone = false;
    this.locate = "QPL";
    this.levelStarted = false;
    this.allAloneCounter = 0;
    this.timeCounter = 0;
    this.NEWLINE = "\n";
    this.timerUpdateRate = 20;
    this.timeOutCounter = 0;
    this.firstTimeIn = true;
    this.timeToGoCounter = 0;
    this.maxPlayers = 5;
    this.inLimbo = false;
    this.pingCount = 0;
    this.totalPingTime = 0;
    this.firstTimeSend = false;
    this.tCounter = 0;
    this.mpLevels = new Array<any>(
      100,
      101,
      102,
      103,
      104,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119
    );
    this.myNextLevel = 100 + Math2.random(10);
    this.timer = new lib.flash.utils.Timer(200);
    this.hostTimer = new lib.flash.utils.Timer(1000);
    this.muteList = new Array<any>();
    this.updaters = new Object();
    this.players = new Array<any>();
    this.finalList = new Array<any>();
    this.currentPing = Math2.random(10000);
  }

  public addPlayer(
    playerID: number,
    playerName: string,
    isPlayer: boolean = false
  ): any {
    var playerShell: PlayerShell = new PlayerShell();
    playerShell.userName = playerName;
    playerShell.id = playerID;
    playerShell.isPlayer = isPlayer;
    playerShell.placing = this.players.length;
    this.players.push(playerShell);
    this.finalList.push(playerShell);
    if (!isPlayer) {
      if (this.locate != "QPL") {
        if (this.locate == "Lobby") {
          if (this.parent["lobby"] && this.parent) {
            this.parent["lobby"].addBar();
          }
        }
      }
    }
    if (isPlayer) {
      playerShell.level = this.playerObject.level;
      playerShell.xp = this.playerObject.xp;
      playerShell.kudos = this.playerObject.kudos;
      playerShell.wins = this.playerObject.wins;
      playerShell.matches = this.playerObject.matches;
      playerShell.time = 0;
      playerShell.colour = this.playerObject.colour;
      playerShell.colour2 = this.playerObject.colour2;
      playerShell.headType = this.playerObject.headType;
      playerShell.handType = this.playerObject.handType;
      playerShell.ping = this.playerObject.ping;
      this.player = playerShell;
      lib.__internal.avm2.Runtime.trace("MY ID IS " + playerShell.id);
    }
  }

  private broadcastPlayerPing(forcePing: boolean = false): any {
    var uVars: any = null;
    var shortSend: boolean = false;
    var shortString: any = null;
    var tot: number = 0;
    var f: any = undefined;
    this.tCounter = 6;
    this.tCounterGoal = 6;
    if (!this.player) {
      return;
    }
    if (this.tCounter == this.tCounterGoal) {
      this.tCounter = 0;
      uVars = new Object();
      shortSend = false;
      shortString = "QD";
      if (this.updaters.ping != this.currentPing) {
        this.updaters.ping = this.currentPing;
        uVars.ping = this.currentPing;
        lib.__internal.avm2.Runtime.trace("CPing");
      }
      if (this.player.host) {
        if (this.updaters.hostTime != this.player.hostTime) {
          this.updaters.hostTime = this.player.hostTime;
          uVars.hostTime = this.player.hostTime;
          lib.__internal.avm2.Runtime.trace("HTime");
        }
      }
      if (this.updaters.xScale != this.player.xScale) {
        this.updaters.xScale = this.player.xScale;
        uVars.scX = this.player.xScale;
        lib.__internal.avm2.Runtime.trace("xScale");
      }
      if (this.updaters.colour != this.player.colour) {
        this.updaters.colour = this.player.colour;
        uVars.colour = this.player.colour;
        lib.__internal.avm2.Runtime.trace("colour");
      }
      if (this.updaters.colour2 != this.player.colour2) {
        this.updaters.colour2 = this.player.colour2;
        uVars.colour2 = this.player.colour2;
        lib.__internal.avm2.Runtime.trace("colour2");
      }
      if (this.updaters.headType != this.player.headType) {
        this.updaters.headType = this.player.headType;
        uVars.pH = this.player.headType;
        lib.__internal.avm2.Runtime.trace("headType");
      }
      if (this.updaters.handType != this.player.handType) {
        this.updaters.handType = this.player.handType;
        uVars.pI = this.player.handType;
        lib.__internal.avm2.Runtime.trace("handType");
      }
      if (this.updaters.xp != this.player.xp) {
        this.updaters.xp = this.player.xp;
        uVars.xp = this.player.xp;
        lib.__internal.avm2.Runtime.trace("xp");
      }
      if (this.updaters.wins != this.player.wins) {
        this.updaters.wins = this.player.wins;
        uVars.wins = this.player.wins;
        lib.__internal.avm2.Runtime.trace("wins");
      }
      if (this.updaters.matches != this.player.matches) {
        this.updaters.matches = this.player.matches;
        uVars.matches = this.player.matches;
        lib.__internal.avm2.Runtime.trace("matches");
      }
      if (this.updaters.kudos != this.player.kudos) {
        this.updaters.kudos = this.player.kudos;
        uVars.kudos = this.player.kudos;
        lib.__internal.avm2.Runtime.trace("kudos");
      }
      if (this.updaters.host != this.player.host) {
        this.updaters.host = this.player.host;
        uVars.host = this.player.host;
        lib.__internal.avm2.Runtime.trace("host");
      }
      shortString = shortString + "x";
      if (this.updaters.xPos != Math.floor(this.player.xPos)) {
        this.updaters.xPos = Math.floor(this.player.xPos);
        shortString = shortString + String(Math.floor(this.player.xPos));
        shortSend = true;
      }
      shortString = shortString + "y";
      if (this.updaters.yPos != Math.floor(this.player.yPos)) {
        this.updaters.yPos = Math.floor(this.player.yPos);
        shortString = shortString + String(Math.floor(this.player.yPos));
        shortSend = true;
      }
      shortString = shortString + "f";
      if (this.updaters.fr != this.player.fr) {
        this.updaters.fr = this.player.fr;
        shortString = shortString + String(this.player.fr);
        shortSend = true;
      }
      shortString = shortString + "q";
      if (this.updaters.time != this.player.time) {
        this.updaters.time = this.player.time;
        uVars.time = this.player.time;
        lib.__internal.avm2.Runtime.trace("time");
      }
      if (forcePing) {
        this.updaters.colour = this.player.colour;
        uVars.colour = this.player.colour;
        this.updaters.colour2 = this.player.colour2;
        uVars.colour2 = this.player.colour2;
        this.updaters.headType = this.player.headType;
        uVars.pH = this.player.headType;
        this.updaters.handType = this.player.handType;
        uVars.pI = this.player.handType;
        this.updaters.xp = this.player.xp;
        uVars.xp = this.player.xp;
        this.updaters.wins = this.player.wins;
        uVars.wins = this.player.wins;
        this.updaters.ping = this.currentPing;
        uVars.ping = this.currentPing;
        this.updaters.matches = this.player.matches;
        uVars.matches = this.player.matches;
        this.updaters.kudos = this.player.kudos;
        uVars.kudos = this.player.kudos;
        this.updaters.host = this.player.host;
        uVars.host = this.player.host;
        this.updaters.hostTime = this.player.hostTime;
        uVars.hostTime = this.player.hostTime;
        this.updaters.xPos = this.player.xPos;
        uVars.xPos = this.player.xPos;
        this.updaters.yPos = this.player.yPos;
        uVars.yPos = this.player.yPos;
      }
      tot = 0;
      for (f in uVars) {
        tot++;
      }
      if (shortSend) {
        shortSend = false;
        this.sendMessage(shortString);
      }
      if (tot != 0) {
        this.setUserVariables(uVars);
      }
    }
  }

  public chooseUserLevel(): any {
    this.myNextLevel = this.myNextLevel + (Math2.random(2) + 1);
    if (this.myNextLevel > 119) {
      this.myNextLevel = 100;
    }
    if (this.myNextLevel < 100) {
      this.myNextLevel = 100;
    }
    this.setRoomVariable("level", String(this.myNextLevel));
  }

  public colourPlayer(plays: PlayerShell): any {
    return (
      "<FONT COLOR='#" +
      Math2.toHex(plays.colour) +
      "'>" +
      plays.userName +
      "</FONT>"
    );
  }

  public createRoom(): any {
    var finalName: any = null;
    var foundName: boolean = false;
    var firstPart: any = null;
    var secondPart: any = null;
    var roomName: any = null;
    var r: any = null;
    var room: any = null;
    var roomObj: any = new Object();
    var nameOk: boolean = false;
    var rooms: any[] = this.sfs.getAllRooms();
    while (!nameOk) {
      foundName = false;
      firstPart = this.randomAnimal();
      secondPart = this.randomRoadType();
      roomName = Math2.random(10000) + " " + firstPart + " " + secondPart;
      for (r in rooms) {
        room = rooms[r];
        if (room.getName() == roomName) {
          foundName = true;
          break;
        }
      }
      if (!foundName) {
        finalName = roomName;
        nameOk = true;
      }
    }
    roomObj.name = finalName;
    roomObj.isGame = true;
    roomObj.maxUsers = this.maxPlayers;
    var variables: any[] = new Array<any>();
    variables.push({
      name: "host",
      val: this.playerObject.userName,
      persistent: true,
    });
    roomObj.vars = variables;
    this.sfs.createRoom(roomObj);
  }

  public debugTrace(msg: string): void {
    this.debuggy.txt.htmlText = this.debuggy.txt.htmlText + msg;
    this.debuggy.txt.appendText(this.NEWLINE);
    this.debuggy.txt.scrollV = this.debuggy.txt.maxScrollV;
  }

  public disconnect(): any {
    this.sfs.disconnect();
  }

  public getMyID(): any {
    return this.sfs.myUserId;
  }

  public getMyName(): any {
    return this.sfs.myUserName;
  }

  public getMyRoom(): any {
    return this.sfs.myUserName;
  }

  public getRoomCount(): any {
    return this.players.length;
  }

  public getRoomMax(): any {
    return this.maxPlayers;
  }

  public getVariable(str: string): any {
    var curRoom: any = this.sfs.getActiveRoom();
    return curRoom.getVariable(str) as string;
  }

  public giveFinalList(arr: any[]): any {
    var j: any = NaN;
    this.finalList = new Array<any>();
    for (var i: any = 0; i < arr.length; i++) {
      for (j = 0; j < this.players.length; j++) {
        if (arr[i].player.userName == this.players[j].userName) {
          this.finalList.push(this.players[j]);
          this.players[j].placing = i;
          break;
        }
      }
    }
    lib.__internal.avm2.Runtime.trace("ARRAY");
    for (i = 0; i < arr.length; i++) {
      lib.__internal.avm2.Runtime.trace(arr[i].player.userName);
    }
    lib.__internal.avm2.Runtime.trace("FINAL");
    for (i = 0; i < this.finalList.length; i++) {
      lib.__internal.avm2.Runtime.trace(this.finalList[i].userName);
    }
    this.timeToGo = this.timeToGoStart;
  }

  public hostDuty(): any {}

  public init(playerObj: any): any {
    this.timer.addEventListener("timer", this.timerHandler);
    this.timer.start();
    this.hostTimer.addEventListener("timer", this.timerHandler2);
    this.hostTimer.start();
    this.playerObject = playerObj;
    this.inLimbo = false;
    this.firstTimeIn = true;
    this.sfs = new SmartFoxClient(true);
    this.sfs.addEventListener(SFSEvent.onConnection, this.onConnection);
    this.sfs.addEventListener(SFSEvent.onConnectionLost, this.onConnectionLost);
    this.sfs.addEventListener(SFSEvent.onLogin, this.onLogin);
    this.sfs.addEventListener(SFSEvent.onRoomListUpdate, this.onRoomListUpdate);
    this.sfs.addEventListener(SFSEvent.onJoinRoom, this.onJoinRoom);
    this.sfs.addEventListener(SFSEvent.onJoinRoomError, this.onJoinRoomError);
    this.sfs.addEventListener(
      SFSEvent.onPrivateMessage,
      this.onPrivateMessageHandler
    );
    this.sfs.addEventListener(
      SFSEvent.onUserEnterRoom,
      this.onUserEnterRoomHandler
    );
    this.sfs.addEventListener(
      SFSEvent.onPublicMessage,
      this.onPublicMessageHandler
    );
    this.sfs.addEventListener(
      SFSEvent.onUserVariablesUpdate,
      this.onUserVariablesUpdateHandler
    );
    this.sfs.addEventListener(
      SFSEvent.onUserLeaveRoom,
      this.onUserLeaveRoomHandler
    );
    this.sfs.addEventListener(SFSEvent.onRoomAdded, this.onRoomAddedHandler);
    this.sfs.addEventListener(
      SFSEvent.onRoomVariablesUpdate,
      this.onRoomVariablesUpdateHandler
    );
    this.sfs.addEventListener(
      SFSEvent.onRoundTripResponse,
      this.onRoundTripResponseHandler
    );
    this.sfs.addEventListener(
      SFSEvent.onAdminMessage,
      this.onAdminMessageHandler
    );
    this.sfs.addEventListener(
      lib.flash.events.SecurityErrorEvent.SECURITY_ERROR,
      this.onSecurityError
    );
    this.sfs.addEventListener(
      lib.flash.events.IOErrorEvent.IO_ERROR,
      this.onIOError
    );
    this.sfs.debug = false;
    if (!this.sfs.isConnected) {
      this.sfs.connect("multiplayer.armorgames.com", 9339);
    } else {
      this.debugTrace("You are already connected!");
    }
  }

  public isPlayerMuted(str: string): any {
    for (var i: any = 0; i < this.muteList.length; i++) {
      if (this.muteList[i] == str) {
        return true;
      }
    }
    return false;
  }

  public joinRoom(roomName: string): any {
    this.sfs.joinRoom(roomName);
  }

  public kill(): any {
    this.timer.removeEventListener("timer", this.timerHandler);
    this.timer.stop();
    this.timer = null;
    this.hostTimer.removeEventListener("timer", this.timerHandler2);
    this.hostTimer.stop();
    this.hostTimer = null;
    this.sfs.removeEventListener(SFSEvent.onConnection, this.onConnection);
    this.sfs.removeEventListener(
      SFSEvent.onConnectionLost,
      this.onConnectionLost
    );
    this.sfs.removeEventListener(SFSEvent.onLogin, this.onLogin);
    this.sfs.removeEventListener(
      SFSEvent.onRoomListUpdate,
      this.onRoomListUpdate
    );
    this.sfs.removeEventListener(SFSEvent.onJoinRoom, this.onJoinRoom);
    this.sfs.removeEventListener(
      SFSEvent.onJoinRoomError,
      this.onJoinRoomError
    );
    this.sfs.removeEventListener(
      SFSEvent.onPrivateMessage,
      this.onPrivateMessageHandler
    );
    this.sfs.removeEventListener(
      SFSEvent.onUserEnterRoom,
      this.onUserEnterRoomHandler
    );
    this.sfs.removeEventListener(
      SFSEvent.onPublicMessage,
      this.onPublicMessageHandler
    );
    this.sfs.removeEventListener(
      SFSEvent.onUserVariablesUpdate,
      this.onUserVariablesUpdateHandler
    );
    this.sfs.removeEventListener(
      SFSEvent.onUserLeaveRoom,
      this.onUserLeaveRoomHandler
    );
    this.sfs.removeEventListener(SFSEvent.onRoomAdded, this.onRoomAddedHandler);
    this.sfs.removeEventListener(
      SFSEvent.onRoomVariablesUpdate,
      this.onRoomVariablesUpdateHandler
    );
    this.sfs.removeEventListener(
      SFSEvent.onRoundTripResponse,
      this.onRoundTripResponseHandler
    );
    this.sfs.removeEventListener(
      SFSEvent.onAdminMessage,
      this.onAdminMessageHandler
    );
    this.sfs.removeEventListener(
      lib.flash.events.SecurityErrorEvent.SECURITY_ERROR,
      this.onSecurityError
    );
    this.sfs.removeEventListener(
      lib.flash.events.IOErrorEvent.IO_ERROR,
      this.onIOError
    );
  }

  public mutePlayer(str: string): any {
    this.muteList.push(str);
    this.debugTrace(
      str + " has been muted, you will no longer see this user's messages."
    );
  }

  public onAdminMessageHandler(evt: SFSEvent): void {
    this.debugTrace(
      "<FONT COLOR='#" +
        Math2.toHex(16711680) +
        "'>" +
        "<B>Admin Overlord Message:</B> " +
        evt.params.message +
        "</FONT>"
    );
  }

  private onConnection(evt: SFSEvent): void {
    var success: boolean = evt.params.success;
    if (success) {
      this.debugTrace("Connection successful!");
      this.parent["step"](1);
      this.sfs.login("ExitGame", this.playerObject.userName, "");
    } else {
      this.debugTrace("Connection failed!");
    }
  }

  private onConnectionLost(evt: SFSEvent): void {
    this.debugTrace("Connection lost!");
  }

  private onIOError(evt: lib.flash.events.IOErrorEvent): void {
    this.debugTrace("I/O Error: " + evt.text);
  }

  private onJoinRoom(evt: SFSEvent): void {
    var u: any = null;
    var curRoom: any = null;
    this.debugTrace("Successfully arrived at " + evt.params.room.getName());
    if (evt.params.room.getName() == "Party Room") {
      this.sfs.getRoomList();
      return;
    }
    this.parent["step"](3);
    var users: any = evt.params.room.getUserList() as object;
    for (u in users) {
      if (users[u].getName() == this.getMyName()) {
        this.addPlayer(users[u].getId(), users[u].getName(), true);
        if (evt.params.room.getVariable("host") == this.playerObject.userName) {
          this.debugTrace("You have been made host of this address!");
          this.setRoomVariable("state", "Lobby");
          this.chooseUserLevel();
          this.resetTimeToGo();
          this.player.host = true;
          if (this.players.length == 1) {
            this.startSingleRoomTimeOut();
          }
        }
      } else {
        this.addPlayer(users[u].getId(), users[u].getName());
      }
    }
    curRoom = this.sfs.getActiveRoom();
    if (curRoom.getUserCount() >= this.minPlayers) {
      this.parent["step"](4);
    }
    this.parent["updateUserCount"](
      curRoom.getUserCount(),
      curRoom.getMaxUsers()
    );
  }

  private onJoinRoomError(evt: SFSEvent): void {
    this.debugTrace(
      "Room join error; the following error occurred: " + evt.params.error
    );
    this.parent["step"](1);
    this.sfs.joinRoom("Party Room");
  }

  private onLogin(evt: SFSEvent): void {
    if (evt.params.success) {
      this.debugTrace("Successfully logged in");
    } else {
      this.debugTrace("Login failed. Reason: " + evt.params.error);
    }
  }

  private onPrivateMessageHandler(evt: SFSEvent): void {
    var playerStuff: any = JSON.parse(evt.params.message);
    for (var i: any = 0; i < this.players.length; i++) {
      if (
        this.players[i].userName == evt.params.sender.getName() &&
        this.players[i] != this.player
      ) {
        this.players[i].xp = playerStuff.xp;
        this.players[i].kudos = playerStuff.kudos;
        this.players[i].wins = playerStuff.wins;
        this.players[i].matches = playerStuff.matches;
        this.players[i].colour = playerStuff.colour;
        this.players[i].colour2 = playerStuff.colour2;
        this.players[i].headType = playerStuff.headType;
        this.players[i].handType = playerStuff.handType;
        this.players[i].host = playerStuff.host;
        if (this.locate == "Lobby") {
          this.parent["lobby"].updateBar(i);
        }
        return;
      }
    }
  }

  private onPublicMessageHandler(evt: SFSEvent): void {
    var giveTo: any = null;
    var oldXP: number = NaN;
    var oldLevel: number = NaN;
    var levelTitle: any = null;
    var levelNum: number = NaN;
    var i: any = NaN;
    if (evt.params.message.substr(0, 2) == "QD") {
      this.parseDataString(
        evt.params.sender.getName(),
        evt.params.message.substr(2, evt.params.message.length)
      );
      return;
    }
    if (evt.params.message.substr(0, 8) == "kudokudo") {
      giveTo = evt.params.message.substr(8, evt.params.message.length);
      if (this.locate == "Lobby") {
        this.parent["lobby"].exchangeKudos(giveTo, evt.params.sender.getName());
      }
      if (giveTo == this.player.userName) {
        oldXP = this.playerObject.xp;
        oldLevel = this.parent["getLevelByXP"](this.playerObject.xp);
        SoundBox.playSound("GetKudos");
        this.debugTrace(
          evt.params.sender.getName() +
            " has given you kudos!  You now have " +
            (this.playerObject.kudos + 1)
        );
        this.player.kudos++;
        this.playerObject.kudos++;
        this.player.xp = this.player.xp + 5;
        this.playerObject.xp = this.playerObject.xp + 5;
        if (this.playerObject.kudos >= 10) {
          this.dispatchEvent(new AchEvent(AchEvent.SEND, 27));
        }
        if (this.playerObject.kudos >= 100) {
          this.dispatchEvent(new AchEvent(AchEvent.SEND, 28));
        }
        if (this.playerObject.kudos >= 250) {
          this.dispatchEvent(new AchEvent(AchEvent.SEND, 29));
        }
        if (this.locate == "Lobby") {
          levelTitle = this.parent["getRankByXP"](this.playerObject.xp);
          levelNum = this.parent["getLevelByXP"](this.playerObject.xp);
          if (levelNum > oldLevel) {
            this.parent["lobby"].levelUpWindow = new LevelUpWindow();
            this.parent["lobby"].levelUpWindow.init(levelNum, levelTitle);
            this.parent["lobby"].addChild(this.parent["lobby"].levelUpWindow);
            this.sendMessage(
              "LVX" +
                this.player.userName +
                " has just leveled up to Level " +
                levelNum +
                ": " +
                levelTitle
            );
            for (i = 0; i < this.players[i]; i++) {
              if (this.players[i].isPlayer) {
                this.parent["lobby"].updateBar(i);
              }
            }
          }
        }
        this.dispatchEvent(new Relay(Relay.GOTO, "SaveGame"));
      }
      return;
    }
    if (evt.params.message.substr(0, 5) == "TIME ") {
      this.timeToGo = Number(evt.params.message.substr(5, 3));
      if (this.locate == "Lobby") {
        this.parent["lobby"].timeToGo = this.timeToGo;
      }
      if (this.timeToGo <= 5 && this.timeToGo >= 0) {
        SoundBox.playSound("Boop1");
        this.startedGame = false;
      }
      if (
        this.parent["game"] &&
        this.locate == "Game" &&
        this.startedGame == false
      ) {
        if (this.timeToGo == -4) {
          this.parent["game"].levelStart.startBox.gotoAndPlay(20);
        }
        if (this.timeToGo == -5) {
          this.parent["game"].levelStart.startBox.gotoAndPlay(36);
        }
        if (this.timeToGo == -6) {
          this.parent["game"].levelStart.startBox.gotoAndPlay(55);
          this.startedGame = true;
        }
        if (
          this.timeToGo <= -7 &&
          this.parent["game"].goAhead == false &&
          this.parent["game"].levelFinished == false
        ) {
          this.parent["game"].goAhead = true;
          this.startedGame = true;
          this.timeToGo = -7;
        }
      }
      return;
    }
    if (evt.params.message.substr(0, 2) == "!!") {
      for (i = 0; i < this.players.length; i++) {
        if (this.players[i].userName == evt.params.sender.getName()) {
          if (this.isPlayerMuted(this.players[i].userName)) {
            return;
          }
          this.debugTrace(
            this.colourPlayer(this.players[i]) +
              ": " +
              evt.params.message.substr(2, evt.params.message.length)
          );
          return;
        }
      }
    }
    if (evt.params.message.substr(0, 5) == "CHECK") {
      if (evt.params.sender.getName() != this.player.userName) {
        this.parent["game"].tCheck(
          evt.params.sender.getName(),
          Number(evt.params.message.substr(5, 1))
        );
      }
      return;
    }
    if (evt.params.message.substr(0, 3) == "LVX") {
      this.debugTrace(
        "<FONT COLOR='#00CC00'>" +
          evt.params.message.substr(3, evt.params.message.length) +
          "</FONT>"
      );
      this.debugTrace(
        "<FONT COLOR='#00CC00'>KudoBomb!  As celebration, all room members earn +2 kudos to give!</FONT>"
      );
      this.player.kudosToGive = this.player.kudosToGive + 2;
      if (this.locate == "Lobby" && this.parent["lobby"]) {
        this.parent["lobby"].updateKudosToGive();
      }
      return;
    }
    switch (evt.params.message) {
      case "die":
        if (this.locate == "Game") {
          this.parent["game"].tDie(
            evt.params.sender.getId(),
            evt.params.sender.getName()
          );
        }
        break;
      case "done":
        break;
      case "START":
        this.timeToGo = 0;
        this.player.kudosToGive = 0;
        SoundBox.playSound("Boop2");
        this.myNextLevel = Number(this.getVariable("level"));
        this.dispatchEvent(new Relay(Relay.GOTO, "Lobby", "StartGame"));
        break;
      default:
        this.debugTrace(
          evt.params.sender.getName() + ": " + evt.params.message
        );
    }
  }

  public onRoomAddedHandler(evt: SFSEvent): void {}

  private onRoomListUpdate(evt: SFSEvent): void {
    var r: any = null;
    var room: any = null;
    if (this.firstTimeIn) {
      this.firstTimeIn = false;
      this.sfs.joinRoom("Party Room");
      return;
    }
    this.parent["step"](2);
    for (r in evt.params.roomList) {
      room = evt.params.roomList[r];
      if (
        room.getName() != "Party Room" &&
        room.isGame() &&
        room.getUserCount() < room.getMaxUsers() &&
        room.getVariable("state") == "Lobby"
      ) {
        this.joinRoom(room.getName());
        return;
      }
    }
    this.debugTrace("No room found, creating room...");
    this.createRoom();
  }

  public onRoomVariablesUpdateHandler(evt: SFSEvent): void {
    var v: any = null;
    var changedVars: any[] = evt.params.changedVars;
    for (v in changedVars) {
      lib.__internal.avm2.Runtime.trace(
        v +
          " room variable was updated; new value is: " +
          evt.params.room.getVariable(v)
      );
      if (v == "level") {
        this.myNextLevel = Number(evt.params.room.getVariable(v));
      }
    }
  }

  public onRoundTripResponseHandler(evt: SFSEvent): void {
    var time: number = evt.params.elapsed;
    this.totalPingTime = this.totalPingTime + time / 2;
    this.pingCount++;
    var avg: number = Math.round(this.totalPingTime / this.pingCount);
    this.currentPing = avg;
    if (this.player) {
      this.player.ping = this.currentPing;
      if (this.firstTimeSend && this.currentPing != 0) {
        this.firstTimeSend = false;
      }
    }
    if (this.locate == "Game") {
      this.parent["game"].updatePing(this.currentPing);
    }
  }

  private onSecurityError(evt: lib.flash.events.SecurityErrorEvent): void {
    this.debugTrace("Security error: " + evt.text);
  }

  public onUserEnterRoomHandler(evt: SFSEvent): void {
    var curRoom: any = this.sfs.getActiveRoom();
    if (curRoom.getName() == "Party Room") {
      return;
    }
    this.debugTrace("User " + evt.params.user.getName() + " entered the room");
    this.addPlayer(evt.params.user.getId(), evt.params.user.getName());
    if (this.allAlone) {
      this.allAlone = false;
    }
    this.parent["updateUserCount"](
      curRoom.getUserCount(),
      curRoom.getMaxUsers()
    );
    if (curRoom.getUserCount() >= this.minPlayers) {
      this.parent["step"](4);
    }
    var obj: any = new Object();
    obj.xp = this.player.xp;
    obj.kudos = this.player.kudos;
    obj.wins = this.player.wins;
    obj.matches = this.player.matches;
    obj.colour = this.player.colour;
    obj.colour2 = this.player.colour2;
    obj.headType = this.player.headType;
    obj.handType = this.player.handType;
    obj.host = this.player.host;
    obj.ping = this.player.ping;
    var myStr: string = JSON.stringify(obj);
    this.sendPrivateMessage(myStr, evt.params.user.getId());
  }

  public onUserLeaveRoomHandler(evt: SFSEvent): void {
    var curRoom: any = this.sfs.getActiveRoom();
    if (curRoom.getName() == "Party Room") {
      return;
    }
    this.debugTrace("User " + evt.params.userName + " left the room");
    if (this.locate == "Game") {
    }
    this.parent["updateUserCount"](
      curRoom.getUserCount(),
      curRoom.getMaxUsers()
    );
    this.removePlayer(evt.params.userID, evt.params.userName);
    if (
      this.player.host &&
      this.players.length == 1 &&
      this.locate == "Lobby"
    ) {
      this.setRoomVariable("state", "Lobby");
    }
  }

  public onUserVariablesUpdateHandler(evt: SFSEvent): void {
    var foundXData: boolean = false;
    var foundYData: boolean = false;
    var frameTimeBetweenCalls: number = NaN;
    var v: any = undefined;
    var ob: any = evt.params;
    var changedVars: any[] = ob.changedVars;
    for (var i: any = 0; i < this.players.length; i++) {
      if (this.players[i].userName == ob.user.getName()) {
        if (this.players[i].isPlayer) {
          return;
        }
        foundXData = false;
        foundYData = false;
        frameTimeBetweenCalls = this.players[i].timer.getFrameTime();
        for (var _loc11_ in changedVars) {
          switch (_loc11_) {
            case "pX":
              this.players[i].toX = Number(ob.user.getVariable("pX"));
              continue;
            case "pY":
              this.players[i].toY = Number(ob.user.getVariable("pY"));
              continue;
            case "fr":
              this.players[i].fr = Number(ob.user.getVariable("fr"));
              continue;
            case "pH":
              this.players[i].headType = Number(ob.user.getVariable("pH"));
              continue;
            case "pI":
              this.players[i].handType = Number(ob.user.getVariable("pI"));
              continue;
            case "scX":
              this.players[i].xScale = ob.user.getVariable("scX");
              continue;
            case "colour":
              this.players[i].colour = ob.user.getVariable("colour");
              continue;
            case "colour2":
              this.players[i].colour2 = ob.user.getVariable("colour2");
              continue;
            case "xp":
              this.players[i].xp = ob.user.getVariable("xp");
              continue;
            case "kudos":
              this.players[i].kudos = ob.user.getVariable("kudos");
              continue;
            case "wins":
              this.players[i].wins = ob.user.getVariable("wins");
              continue;
            case "matches":
              this.players[i].matches = ob.user.getVariable("matches");
              continue;
            case "host":
              this.players[i].host = ob.user.getVariable("host");
              continue;
            case "hostTime":
              this.players[i].hostTime = ob.user.getVariable("hostTime");
              if (this.locate == "Game") {
                if (this.parent["game"]) {
                  this.parent["game"].timer.setTime(this.players[i].hostTime);
                }
              }
              continue;
            case "ping":
              this.players[i].ping = ob.user.getVariable("ping");
              continue;
            case "stopX":
              this.players[i].oldX = this.players[i].xPos;
              continue;
            case "stopY":
              this.players[i].oldY = this.players[i].yPos;
              continue;
            case "xPos":
              this.players[i].xPos = ob.user.getVariable("xPos");
              foundXData = true;
              continue;
            case "yPos":
              this.players[i].yPos = ob.user.getVariable("yPos");
              foundYData = true;
              continue;
            case "time":
              this.players[i].time = ob.user.getVariable("time");
              if (this.players[i].time > 0) {
                this.debugTrace(
                  this.players[i].userName + " has just beat the level."
                );
                if (this.locate == "Game") {
                  this.parent["game"].iAmDone(this.players[i].userName);
                }
              }
              continue;
            default:
              continue;
          }
        }
        if (this.locate == "Lobby") {
          this.parent["lobby"].updateBar(i);
        } else if (this.locate == "Game") {
        }
        return;
      }
    }
  }

  public parseDataString(nam: string, str: string): any {
    var playerShe: any = null;
    var i: any = 0;
    for (i = 0; i < this.players.length; i++) {
      if (this.players[i].userName == nam) {
        playerShe = this.players[i];
        if (this.players[i].userName == this.player.userName) {
          return;
        }
        break;
      }
    }
    playerShe.tCounter = 0;
    playerShe.oldX = playerShe.xPos;
    playerShe.oldY = playerShe.yPos;
    playerShe.xV = 0;
    playerShe.yV = 0;
    var wX: any = 0;
    var wY: any = 0;
    var wF: any = 0;
    var wQ: any = 0;
    for (i = 0; i < str.length; i++) {
      if (str.substr(i, 1) == "x") {
        wX = Number(i);
      }
      if (str.substr(i, 1) == "y") {
        wY = Number(i);
      }
      if (str.substr(i, 1) == "f") {
        wF = Number(i);
      }
      if (str.substr(i, 1) == "q") {
        wQ = Number(i);
      }
    }
    var foundXData: boolean = false;
    var foundYData: boolean = false;
    if (wY - wX != 1) {
      playerShe.xPos = Number(str.substr(wX + 1, wY - wX - 1));
      foundXData = true;
      lib.__internal.avm2.Runtime.trace("xPos" + playerShe.xPos);
    }
    if (wF - wY != 1) {
      playerShe.yPos = Number(str.substr(wY + 1, wF - wY - 1));
      foundYData = true;
      lib.__internal.avm2.Runtime.trace("yPos" + playerShe.yPos);
    }
    if (wQ - wF != 1) {
      playerShe.fr = Number(str.substr(wF + 1, wQ - wF - 1));
      lib.__internal.avm2.Runtime.trace("fr" + playerShe.fr);
    }
    playerShe.tCounterGoal = 6 + Math.floor((this.currentPing / 1000) * 30);
    if (foundXData) {
      playerShe.xV = (playerShe.xPos - playerShe.oldX) / playerShe.tCounterGoal;
    } else {
      playerShe.xV = 0;
      playerShe.oldX = playerShe.xPos;
    }
    if (foundYData) {
      playerShe.yV = (playerShe.yPos - playerShe.oldY) / playerShe.tCounterGoal;
    } else {
      playerShe.yV = 0;
      playerShe.oldY = playerShe.yPos;
    }
    if (this.locate == "Lobby") {
      this.parent["lobby"].updateBar(i);
    } else if (this.locate == "Game") {
    }
  }

  public ping(): any {
    this.pingCounter++;
    if (this.pingCounter >= 90) {
      this.pingCounter = 0;
      this.sfs.roundTripBench();
    }
    this.hostDuty();
    if (this.locate == "Game") {
      this.talkToTheGame();
    }
    this.timeOutPlayer();
  }

  public randomAnimal(): any {
    var animals: any[] = new Array<any>(
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
    return animals[Math2.random(animals.length - 1)];
  }

  public randomNoun(): any {
    var nouns: any[] = new Array<any>(
      "Stadium",
      "Farm",
      "Factory",
      "Park",
      "Lake",
      "Forest",
      "Island",
      "Market",
      "Garden",
      "Bunker"
    );
    return nouns[Math2.random(nouns.length - 1)];
  }

  public randomRoadType(): any {
    var roadTypes: any[] = new Array<any>(
      "Rd.",
      "St.",
      "Blvd.",
      "Alley.",
      "Ave.",
      "Ct.",
      "Ln.",
      "Dr."
    );
    return roadTypes[Math2.random(roadTypes.length - 1)];
  }

  public removePlayer(playerID: number, playerName: string): any {
    var j: any = NaN;
    var lowestIDSet: boolean = false;
    var lowestID: any = NaN;
    var hostSet: boolean = false;
    for (var i: any = 0; i < this.players.length; i++) {
      if (this.players[i].userName == playerName) {
        for (j = 0; j < this.players.length; j++) {
          if (this.finalList[j] == this.players[i]) {
            this.finalList.splice(j, 1);
            break;
          }
        }
        if (this.players[i].host) {
          lowestIDSet = false;
          lowestID = 0;
          hostSet = false;
          for (j = 0; j < this.players.length; j++) {
            if (i != j) {
              if (!lowestIDSet) {
                lowestIDSet = true;
                lowestID = Number(j);
              } else if (this.players[j].ping < this.players[lowestID].ping) {
                lowestID = Number(j);
                hostSet = true;
              } else if (this.players[j].ping == this.players[lowestID].ping) {
                if (this.players[j].id < this.players[lowestID].id) {
                  lowestID = Number(j);
                  hostSet = true;
                }
              }
            }
          }
          if (this.players[lowestID].userName == this.player.userName) {
            this.player.host = true;
            this.debugTrace(
              "You have been made host of this address! (Ping:" +
                this.player.ping +
                ")"
            );
            this.setRoomVariable("host", this.playerObject.userName);
            if (this.locate == "Lobby") {
              this.setRoomVariable("state", "Lobby");
            } else {
              this.setRoomVariable("state", "Game");
            }
            this.chooseUserLevel();
          } else {
            this.players[lowestID].host = true;
          }
        }
        if (this.locate == "Lobby") {
          this.parent["lobby"].removeBar(i);
        }
        if (this.locate == "Game") {
          this.parent["game"].tRemovePlayer(this.players[i].userName);
        }
        this.players[i] = null;
        this.players.splice(i, 1);
        return;
      }
    }
  }

  public resetTimeToGo(): any {
    this.timeToGo = this.timeToGoStart;
    this.timeToGoCounter = 0;
  }

  public sendMessage(msg: string): any {
    this.sfs.sendPublicMessage(msg);
  }

  public sendPrivateMessage(msg: string, uid: number): any {
    this.sfs.sendPrivateMessage(msg, uid);
  }

  public sendTime(): any {
    this.broadcastPlayerPing();
  }

  public setRoomVariable(vari: string, valu: string): any {
    lib.__internal.avm2.Runtime.trace("SET ROOM VARIABLE", vari, valu);
    var rVars: any[] = new Array<any>();
    rVars.push({ name: vari, val: valu, persistent: true });
    this.sfs.setRoomVariables(rVars);
  }

  public setUserVariables(userVars: any): any {
    this.sfs.setUserVariables(userVars);
  }

  public startSingleRoomTimeOut(): any {
    this.allAlone = true;
    this.allAloneCounter = 0;
  }

  public talkToTheGame(): any {}

  public timeOutPlayer(): any {}

  public timerHandler(event: lib.flash.events.TimerEvent): void {
    this.broadcastPlayerPing();
  }

  public timerHandler2(event: lib.flash.events.TimerEvent): void {
    this.timeOutCounter++;
    if (this.timeOutCounter > 120) {
      this.dispatchEvent(new Relay(Relay.GOTO, "Tubes", "TimeOut"));
      this.timeOutCounter = 0;
      return;
    }
    if (this.allAlone) {
      this.allAloneCounter++;
    }
    if (Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT)) {
      this.timeOutCounter = 0;
    }
    if (this.player) {
      if (!this.player.host) {
        return;
      }
      if (this.players.length > 1 && !this.allAlone) {
        this.timeToGo--;
        if (this.timeToGo < -7) {
          this.timeToGo = -7;
        }
        if (this.timeToGo < 0 && this.locate == "Lobby") {
          this.timeToGo = this.timeToGoStart;
        }
        if (this.timeToGo > 10 && this.locate == "Game") {
          this.timeToGo = -7;
        }
        if (this.timeToGo > 25 || this.timeToGo < -7) {
          this.timeToGo = 25;
        }
        if (isNaN(this.timeToGo)) {
          this.timeToGo = 25;
        }
      } else {
        this.timeToGo = this.timeToGoStart;
      }
      if (this.timeToGo == 0) {
        this.sendMessage("START");
        this.timeToGo = 0;
        this.timeToGoCounter = -10000;
      } else {
        this.timeToGoCounter = 0;
        if (this.timeToGo == 5) {
          if (this.player.host) {
            this.setRoomVariable("state", "Game");
          }
        }
        this.sendMessage("TIME " + this.timeToGo);
      }
      return;
    }
  }

  public unMutePlayer(str: string): any {
    for (var i: any = 0; i < this.muteList.length; i++) {
      if (this.muteList[i] == str) {
        this.muteList.splice(i, 1);
        this.debugTrace(str + " is now unmuted.");
        return;
      }
    }
  }
}
