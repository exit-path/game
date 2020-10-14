import lib from "swf-lib";
import { IMessageHandler } from "./IMessageHandler";
import { SmartFoxClient } from "../SmartFoxClient";
import { SFSEvent } from "../SFSEvent";
import { Entities } from "../util/Entities";
import { User } from "../data/User";
import { ObjectSerializer } from "../util/ObjectSerializer";
import { Room } from "../data/Room";

export class SysHandler implements IMessageHandler {
  static readonly [IMessageHandler.__IMPL] = true;
  private declare handlersTable: any[];

  private declare sfs: SmartFoxClient;

  public constructor(sfs: SmartFoxClient) {
    this.sfs = sfs;
    this.handlersTable = [];
    this.handlersTable["apiOK"] = this.handleApiOK;
    this.handlersTable["apiKO"] = this.handleApiKO;
    this.handlersTable["logOK"] = this.handleLoginOk;
    this.handlersTable["logKO"] = this.handleLoginKo;
    this.handlersTable["logout"] = this.handleLogout;
    this.handlersTable["rmList"] = this.handleRoomList;
    this.handlersTable["uCount"] = this.handleUserCountChange;
    this.handlersTable["joinOK"] = this.handleJoinOk;
    this.handlersTable["joinKO"] = this.handleJoinKo;
    this.handlersTable["uER"] = this.handleUserEnterRoom;
    this.handlersTable["userGone"] = this.handleUserLeaveRoom;
    this.handlersTable["pubMsg"] = this.handlePublicMessage;
    this.handlersTable["prvMsg"] = this.handlePrivateMessage;
    this.handlersTable["dmnMsg"] = this.handleAdminMessage;
    this.handlersTable["modMsg"] = this.handleModMessage;
    this.handlersTable["dataObj"] = this.handleASObject;
    this.handlersTable["rVarsUpdate"] = this.handleRoomVarsUpdate;
    this.handlersTable["roomAdd"] = this.handleRoomAdded;
    this.handlersTable["roomDel"] = this.handleRoomDeleted;
    this.handlersTable["rndK"] = this.handleRandomKey;
    this.handlersTable["roundTripRes"] = this.handleRoundTripBench;
    this.handlersTable["uVarsUpdate"] = this.handleUserVarsUpdate;
    this.handlersTable["createRmKO"] = this.handleCreateRoomError;
    this.handlersTable["bList"] = this.handleBuddyList;
    this.handlersTable["bUpd"] = this.handleBuddyListUpdate;
    this.handlersTable["bAdd"] = this.handleBuddyAdded;
    this.handlersTable["roomB"] = this.handleBuddyRoom;
    this.handlersTable["leaveRoom"] = this.handleLeaveRoom;
    this.handlersTable["swSpec"] = this.handleSpectatorSwitched;
    this.handlersTable["bPrm"] = this.handleAddBuddyPermission;
    this.handlersTable["remB"] = this.handleRemoveBuddy;
    this.handlersTable["swPl"] = this.handlePlayerSwitched;
  }

  public dispatchDisconnection(): void {
    var evt: SFSEvent = new SFSEvent(SFSEvent.onConnectionLost, null);
    this.sfs.dispatchEvent(evt);
  }

  private handleAddBuddyPermission(o: any): void {
    var params: any = {};
    params.sender = o.body.n.toString();
    params.message = "";
    if (o.body.txt != undefined) {
      params.message = Entities.decodeEntities(o.body.txt);
    }
    var evt: SFSEvent = new SFSEvent(SFSEvent.onBuddyPermissionRequest, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleAdminMessage(o: any): void {
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var message: string = o.body.txt;
    var params: any = {};
    params.message = Entities.decodeEntities(message);
    var evt: SFSEvent = new SFSEvent(SFSEvent.onAdminMessage, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleApiKO(o: any): void {
    var params: any = {};
    params.success = false;
    params.error = "API are obsolete, please upgrade";
    var evt: SFSEvent = new SFSEvent(SFSEvent.onConnection, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleApiOK(o: any): void {
    this.sfs.isConnected = true;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onConnection, { success: true });
    this.sfs.dispatchEvent(evt);
  }

  public handleASObject(o: any): void {
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var xmlStr: string = o.body.dataObj;
    var sender: User = this.sfs.getRoom(roomId).getUser(userId);
    var asObj: any = ObjectSerializer.getInstance().deserialize(
      new lib.__internal.avm2.XML(xmlStr)
    );
    var params: any = {};
    params.obj = asObj;
    params.sender = sender;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onObjectReceived, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleBuddyAdded(o: any): void {
    var bVar: any = null;
    var buddy: any = {};
    buddy.isOnline = o.body.b.s == "1" ? true : false;
    buddy.name = o.body.b.n.toString();
    buddy.id = o.body.b.i;
    buddy.isBlocked = o.body.b.x == "1" ? true : false;
    buddy.variables = {};
    var bVars: lib.__internal.avm2.XMLList = o.body.b.vs;
    if (bVars.toString().length > 0) {
      for (bVar of bVars.v) {
        buddy.variables[bVar.n.toString()] = bVar.toString();
      }
    }
    this.sfs.buddyList.push(buddy);
    var params: any = {};
    params.list = this.sfs.buddyList;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onBuddyList, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleBuddyList(o: any): void {
    var buddy: any = null;
    var myVar: any = null;
    var b: any = null;
    var bVars: any = null;
    var bVar: any = null;
    var bList: lib.__internal.avm2.XMLList = o.body.bList;
    var myVars: lib.__internal.avm2.XMLList = o.body.mv;
    var params: any = {};
    var evt: any = null;
    if (myVars != null && myVars.toString().length > 0) {
      for (myVar of myVars.v) {
        this.sfs.myBuddyVars[myVar.n.toString()] = myVar.toString();
      }
    }
    if (bList != null && bList.b.length != null) {
      if (bList.toString().length > 0) {
        for (b of bList.b) {
          buddy = {};
          buddy.isOnline = b.s == "1" ? true : false;
          buddy.name = b.n.toString();
          buddy.id = b.i;
          buddy.isBlocked = b.x == "1" ? true : false;
          buddy.variables = {};
          bVars = b.vs;
          if (bVars.toString().length > 0) {
            for (bVar of bVars.v) {
              buddy.variables[bVar.n.toString()] = bVar.toString();
            }
          }
          this.sfs.buddyList.push(buddy);
        }
      }
      params.list = this.sfs.buddyList;
      evt = new SFSEvent(SFSEvent.onBuddyList, params);
      this.sfs.dispatchEvent(evt);
    } else {
      params.error = o.body.err.toString();
      evt = new SFSEvent(SFSEvent.onBuddyListError, params);
      this.sfs.dispatchEvent(evt);
    }
  }

  private handleBuddyListUpdate(o: any): void {
    var buddy: any = null;
    var bVars: any = null;
    var tempB: any = null;
    var found: boolean = false;
    var it: any = null;
    var bVar: any = null;
    var params: any = {};
    var evt: any = null;
    if (o.body.err.toString().length > 0) {
      params.error = o.body.err.toString();
      evt = new SFSEvent(SFSEvent.onBuddyListError, params);
      this.sfs.dispatchEvent(evt);
      return;
    }
    if (o.body.b != null) {
      buddy = {};
      buddy.isOnline = o.body.b.s == "1" ? true : false;
      buddy.name = o.body.b.n.toString();
      buddy.id = o.body.b.i;
      buddy.isBlocked = o.body.b.x == "1" ? true : false;
      bVars = o.body.b.vs;
      tempB = null;
      found = false;
      for (it in this.sfs.buddyList) {
        tempB = this.sfs.buddyList[it];
        if (tempB.name == buddy.name) {
          this.sfs.buddyList[it] = buddy;
          buddy.isBlocked = tempB.isBlocked;
          buddy.variables = tempB.variables;
          if (bVars.toString().length > 0) {
            for (bVar of bVars.v) {
              buddy.variables[bVar.n.toString()] = bVar.toString();
            }
          }
          found = true;
          break;
        }
      }
      if (found) {
        params.buddy = buddy;
        evt = new SFSEvent(SFSEvent.onBuddyListUpdate, params);
        this.sfs.dispatchEvent(evt);
      }
    }
  }

  private handleBuddyRoom(o: any): void {
    var roomIds: string = o.body.br.r;
    var ids: any[] = roomIds.split(",");
    for (var i: number = 0; i < ids.length; i++) {
      ids[i] = lib.__internal.avm2.Runtime.int(ids[i]);
    }
    var params: any = {};
    params.idList = ids;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onBuddyRoom, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleCreateRoomError(o: any): void {
    var errMsg: string = o.body.room.e;
    var params: any = {};
    params.error = errMsg;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onCreateRoomError, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleJoinKo(o: any): void {
    this.sfs.changingRoom = false;
    var params: any = {};
    params.error = o.body.error.msg;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onJoinRoomError, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleJoinOk(o: any): void {
    var usr: any = null;
    var params: any = null;
    var evt: any = null;
    var name: any = null;
    var id: number = 0;
    var isMod: boolean = false;
    var isSpec: boolean = false;
    var pId: number = 0;
    var user: any = null;
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var roomVarsXml: lib.__internal.avm2.XMLList = o.body;
    var userListXml: lib.__internal.avm2.XMLList = o.body.uLs.u;
    var playerId: number = lib.__internal.avm2.Runtime.int(o.body.pid.id);
    this.sfs.activeRoomId = roomId;
    var currRoom: Room = this.sfs.getRoom(roomId);
    currRoom.clearUserList();
    this.sfs.playerId = playerId;
    currRoom.setMyPlayerIndex(playerId);
    if (roomVarsXml.vars.toString().length > 0) {
      currRoom.clearVariables();
      this.populateVariables(currRoom.getVariables(), roomVarsXml);
    }
    for (usr of userListXml) {
      name = usr.n;
      id = lib.__internal.avm2.Runtime.int(usr.i);
      isMod = usr.m == "1" ? true : false;
      isSpec = usr.s == "1" ? true : false;
      pId =
        usr.p == null
          ? -1
          : lib.__internal.avm2.Runtime.int(
              lib.__internal.avm2.Runtime.int(usr.p)
            );
      user = new User(id, name);
      user.setModerator(isMod);
      user.setIsSpectator(isSpec);
      user.setPlayerId(pId);
      if (usr.vars.toString().length > 0) {
        this.populateVariables(user.getVariables(), usr);
      }
      currRoom.addUser(user, id);
    }
    this.sfs.changingRoom = false;
    params = {};
    params.room = currRoom;
    evt = new SFSEvent(SFSEvent.onJoinRoom, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleLeaveRoom(o: any): void {
    var params: any = null;
    var evt: any = null;
    var roomLeft: number = lib.__internal.avm2.Runtime.int(o.body.rm.id);
    var roomList: any[] = this.sfs.getAllRooms();
    if (roomList[roomLeft]) {
      params = {};
      params.roomId = roomLeft;
      evt = new SFSEvent(SFSEvent.onRoomLeft, params);
      this.sfs.dispatchEvent(evt);
    }
  }

  public handleLoginKo(o: any): void {
    var params: any = {};
    params.success = false;
    params.error = o.body.login.e;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onLogin, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleLoginOk(o: any): void {
    var uid: number = lib.__internal.avm2.Runtime.int(o.body.login.id);
    var mod: number = lib.__internal.avm2.Runtime.int(o.body.login.mod);
    var name: string = o.body.login.n;
    this.sfs.amIModerator = mod == 1;
    this.sfs.myUserId = uid;
    this.sfs.myUserName = name;
    this.sfs.playerId = -1;
    var params: any = {};
    params.success = true;
    params.name = name;
    params.error = "";
    var evt: SFSEvent = new SFSEvent(SFSEvent.onLogin, params);
    this.sfs.dispatchEvent(evt);
    this.sfs.getRoomList();
  }

  public handleLogout(o: any): void {
    this.sfs.__logout();
    var evt: SFSEvent = new SFSEvent(SFSEvent.onLogout, {});
    this.sfs.dispatchEvent(evt);
  }

  public handleMessage(msgObj: any, type: string): void {
    var xmlData: lib.__internal.avm2.XML = msgObj as lib.__internal.avm2.XML;
    var action: string = xmlData.body.action;
    var fn: Function = this.handlersTable[action];
    if (fn != null) {
      fn.apply(this, [msgObj]);
    } else {
      lib.__internal.avm2.Runtime.trace("Unknown sys command: " + action);
    }
  }

  public handleModMessage(o: any): void {
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var message: string = o.body.txt;
    var sender: any = null;
    var room: Room = this.sfs.getRoom(roomId);
    if (room != null) {
      sender = this.sfs.getRoom(roomId).getUser(userId);
    }
    var params: any = {};
    params.message = Entities.decodeEntities(message);
    params.sender = sender;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onModeratorMessage, params);
    this.sfs.dispatchEvent(evt);
  }

  private handlePlayerSwitched(o: any): void {
    var userId: number = 0;
    var user: any = null;
    var params: any = null;
    var evt: any = null;
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var playerId: number = lib.__internal.avm2.Runtime.int(o.body.pid.id);
    var isItMe: any = o.body.pid.u == undefined;
    var theRoom: Room = this.sfs.getRoom(roomId);
    if (playerId == -1) {
      theRoom.setUserCount(theRoom.getUserCount() - 1);
      theRoom.setSpectatorCount(theRoom.getSpectatorCount() + 1);
      if (!isItMe) {
        userId = lib.__internal.avm2.Runtime.int(o.body.pid.u);
        user = theRoom.getUser(userId);
        if (user != null) {
          user.setIsSpectator(true);
          user.setPlayerId(playerId);
        }
      }
    }
    if (isItMe) {
      this.sfs.playerId = playerId;
      params = {};
      params.success = playerId == -1;
      params.newId = playerId;
      params.room = theRoom;
      evt = new SFSEvent(SFSEvent.onPlayerSwitched, params);
      this.sfs.dispatchEvent(evt);
    }
  }

  public handlePrivateMessage(o: any): void {
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var message: string = o.body.txt;
    var sender: User = this.sfs.getRoom(roomId).getUser(userId);
    var params: any = {};
    params.message = Entities.decodeEntities(message);
    params.sender = sender;
    params.roomId = roomId;
    params.userId = userId;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onPrivateMessage, params);
    this.sfs.dispatchEvent(evt);
  }

  public handlePublicMessage(o: any): void {
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var message: string = o.body.txt;
    var sender: User = this.sfs.getRoom(roomId).getUser(userId);
    var params: any = {};
    params.message = Entities.decodeEntities(message);
    params.sender = sender;
    params.roomId = roomId;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onPublicMessage, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleRandomKey(o: any): void {
    var key: string = o.body.k.toString();
    var params: any = {};
    params.key = key;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onRandomKey, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleRemoveBuddy(o: any): void {
    var it: any = null;
    var params: any = null;
    var evt: any = null;
    var buddyName: string = o.body.n.toString();
    var buddy: any = null;
    for (it in this.sfs.buddyList) {
      buddy = this.sfs.buddyList[it];
      if (buddy.name == buddyName) {
        delete this.sfs.buddyList[it];
        params = {};
        params.list = this.sfs.buddyList;
        evt = new SFSEvent(SFSEvent.onBuddyList, params);
        this.sfs.dispatchEvent(evt);
        break;
      }
    }
  }

  private handleRoomAdded(o: any): void {
    var rId: number = lib.__internal.avm2.Runtime.int(o.body.rm.id);
    var rName: string = o.body.rm.name;
    var rMax: number = lib.__internal.avm2.Runtime.int(o.body.rm.max);
    var rSpec: number = lib.__internal.avm2.Runtime.int(o.body.rm.spec);
    var isTemp: boolean = o.body.rm.temp == "1" ? true : false;
    var isGame: boolean = o.body.rm.game == "1" ? true : false;
    var isPriv: boolean = o.body.rm.priv == "1" ? true : false;
    var isLimbo: boolean = o.body.rm.limbo == "1" ? true : false;
    var newRoom: Room = new Room(
      rId,
      rName,
      rMax,
      rSpec,
      isTemp,
      isGame,
      isPriv,
      isLimbo
    );
    var rList: any[] = this.sfs.getAllRooms();
    rList[rId] = newRoom;
    if (o.body.rm.vars.toString().length > 0) {
      this.populateVariables(newRoom.getVariables(), o.body.rm);
    }
    var params: any = {};
    params.room = newRoom;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onRoomAdded, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleRoomDeleted(o: any): void {
    var evt: any = null;
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.rm.id);
    var roomList: any[] = this.sfs.getAllRooms();
    var params: any = {};
    params.room = roomList[roomId];
    if (roomList[roomId] != null) {
      delete roomList[roomId];
      evt = new SFSEvent(SFSEvent.onRoomDeleted, params);
      this.sfs.dispatchEvent(evt);
    }
  }

  public handleRoomList(o: any): void {
    var roomXml: any = null;
    var params: any = null;
    var evt: any = null;
    var roomId: number = 0;
    var room: any = null;
    var oldRoom: any = null;
    var roomList: any[] = this.sfs.getAllRooms();
    for (roomXml of o.body.rmList.rm) {
      roomId = lib.__internal.avm2.Runtime.int(roomXml.id);
      room = new Room(
        roomId,
        roomXml.n,
        lib.__internal.avm2.Runtime.int(roomXml.maxu),
        lib.__internal.avm2.Runtime.int(roomXml.maxs),
        roomXml.temp == "1",
        roomXml.game == "1",
        roomXml.priv == "1",
        roomXml.lmb == "1",
        lib.__internal.avm2.Runtime.int(roomXml.ucnt),
        lib.__internal.avm2.Runtime.int(roomXml.scnt)
      );
      if (roomXml.vars.toString().length > 0) {
        this.populateVariables(room.getVariables(), roomXml);
      }
      oldRoom = roomList[roomId];
      if (oldRoom != null) {
        room.setVariables(oldRoom.getVariables());
        room.setUserList(oldRoom.getUserList());
      }
      roomList[roomId] = room;
    }
    params = {};
    params.roomList = roomList;
    evt = new SFSEvent(SFSEvent.onRoomListUpdate, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleRoomVarsUpdate(o: any): void {
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var currRoom: Room = this.sfs.getRoom(roomId);
    var changedVars: any = [];
    if (o.body.vars.toString().length > 0) {
      this.populateVariables(currRoom.getVariables(), o.body, changedVars);
    }
    var params: any = {};
    params.room = currRoom;
    params.changedVars = changedVars;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onRoomVariablesUpdate, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleRoundTripBench(o: any): void {
    var now: number = lib.flash.utils.getTimer();
    var res: number = now - this.sfs.getBenchStartTime();
    var params: any = {};
    params.elapsed = res;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onRoundTripResponse, params);
    this.sfs.dispatchEvent(evt);
  }

  private handleSpectatorSwitched(o: any): void {
    var userId: number = 0;
    var user: any = null;
    var params: any = null;
    var evt: any = null;
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var playerId: number = lib.__internal.avm2.Runtime.int(o.body.pid.id);
    var theRoom: Room = this.sfs.getRoom(roomId);
    if (playerId > 0) {
      theRoom.setUserCount(theRoom.getUserCount() + 1);
      theRoom.setSpectatorCount(theRoom.getSpectatorCount() - 1);
    }
    if (o.body.pid.u != undefined) {
      userId = lib.__internal.avm2.Runtime.int(o.body.pid.u);
      user = theRoom.getUser(userId);
      if (user != null) {
        user.setIsSpectator(false);
        user.setPlayerId(playerId);
      }
    } else {
      this.sfs.playerId = playerId;
      params = {};
      params.success = this.sfs.playerId > 0;
      params.newId = this.sfs.playerId;
      params.room = theRoom;
      evt = new SFSEvent(SFSEvent.onSpectatorSwitched, params);
      this.sfs.dispatchEvent(evt);
    }
  }

  public handleUserCountChange(o: any): void {
    var params: any = null;
    var evt: any = null;
    var uCount: number = lib.__internal.avm2.Runtime.int(o.body.u);
    var sCount: number = lib.__internal.avm2.Runtime.int(o.body.s);
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var room: Room = this.sfs.getAllRooms()[roomId];
    if (room != null) {
      room.setUserCount(uCount);
      room.setSpectatorCount(sCount);
      params = {};
      params.room = room;
      evt = new SFSEvent(SFSEvent.onUserCountChange, params);
      this.sfs.dispatchEvent(evt);
    }
  }

  public handleUserEnterRoom(o: any): void {
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var usrId: number = lib.__internal.avm2.Runtime.int(o.body.u.i);
    var usrName: string = o.body.u.n;
    var isMod: any = o.body.u.m == "1";
    var isSpec: any = o.body.u.s == "1";
    var pid: number =
      o.body.u.p != null
        ? lib.__internal.avm2.Runtime.int(
            lib.__internal.avm2.Runtime.int(o.body.u.p)
          )
        : -1;
    var varList: lib.__internal.avm2.XMLList = o.body.u.vars["var"];
    var currRoom: Room = this.sfs.getRoom(roomId);
    var newUser: User = new User(usrId, usrName);
    newUser.setModerator(isMod);
    newUser.setIsSpectator(isSpec);
    newUser.setPlayerId(pid);
    currRoom.addUser(newUser, usrId);
    if (o.body.u.vars.toString().length > 0) {
      this.populateVariables(newUser.getVariables(), o.body.u);
    }
    var params: any = {};
    params.roomId = roomId;
    params.user = newUser;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onUserEnterRoom, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleUserLeaveRoom(o: any): void {
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var roomId: number = lib.__internal.avm2.Runtime.int(o.body.r);
    var theRoom: Room = this.sfs.getRoom(roomId);
    var uName: string = theRoom.getUser(userId).getName();
    theRoom.removeUser(userId);
    var params: any = {};
    params.roomId = roomId;
    params.userId = userId;
    params.userName = uName;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onUserLeaveRoom, params);
    this.sfs.dispatchEvent(evt);
  }

  public handleUserVarsUpdate(o: any): void {
    var changedVars: any = null;
    var room: any = null;
    var params: any = null;
    var evt: any = null;
    var userId: number = lib.__internal.avm2.Runtime.int(o.body.user.id);
    var varOwner: any = null;
    var returnUser: any = null;
    if (o.body.vars.toString().length > 0) {
      for (room of this.sfs.getAllRooms()) {
        varOwner = room.getUser(userId);
        if (varOwner != null) {
          if (returnUser == null) {
            returnUser = varOwner;
          }
          changedVars = [];
          this.populateVariables(varOwner.getVariables(), o.body, changedVars);
        }
      }
      params = {};
      params.user = returnUser;
      params.changedVars = changedVars;
      evt = new SFSEvent(SFSEvent.onUserVariablesUpdate, params);
      this.sfs.dispatchEvent(evt);
    }
  }

  private populateVariables(
    variables: any[],
    xmlData: any,
    changedVars: any[] = null
  ): void {
    var v: any = null;
    var vName: any = null;
    var vType: any = null;
    var vValue: any = null;
    for (v of xmlData.vars["var"]) {
      vName = v.n;
      vType = v.t;
      vValue = v;
      lib.__internal.avm2.Runtime.trace(
        vName + ": " + vValue + " (" + vType + ")"
      );
      if (changedVars != null) {
        changedVars.push(vName);
        changedVars[vName] = true;
      }
      if (vType == "b") {
        variables[vName] = vValue == "1" ? true : false;
      } else if (vType == "n") {
        variables[vName] = Number(vValue);
      } else if (vType == "s") {
        variables[vName] = vValue;
      } else if (vType == "x") {
        delete variables[vName];
      }
    }
  }
}
