import lib from "swf-lib";
import { ExtHandler } from "./handlers/ExtHandler";
import { HttpConnection } from "./http/HttpConnection";
import { SysHandler } from "./handlers/SysHandler";
import { HttpEvent } from "./http/HttpEvent";
import { IMessageHandler } from "./handlers/IMessageHandler";
import { SFSEvent } from "./SFSEvent";
import { Room } from "./data/Room";
import { Entities } from "./util/Entities";
import { ObjectSerializer } from "./util/ObjectSerializer";
import { User } from "./data/User";

export class SmartFoxClient extends lib.flash.events.EventDispatcher {
  private declare _httpPollSpeed: number;

  public declare activeRoomId: number;

  public declare amIModerator: boolean;

  private declare autoConnectOnConfigSuccess: boolean;

  private declare benchStartTime: number;

  public declare blueBoxIpAddress: string;

  public declare blueBoxPort: number;

  public declare buddyList: any[];

  private declare byteBuffer: lib.flash.utils.ByteArray;

  public declare changingRoom: boolean;

  private declare connected: boolean;

  public static readonly CONNECTION_MODE_DISCONNECTED: string = "disconnected";

  public static readonly CONNECTION_MODE_HTTP: string = "http";

  public static readonly CONNECTION_MODE_SOCKET: string = "socket";

  public declare debug: boolean;

  private static DEFAULT_POLL_SPEED: number = 750;

  public declare defaultZone: string;

  private static readonly EOM: number = 0;

  private declare extHandler: ExtHandler;

  private static HTTP_POLL_REQUEST: string = "poll";

  private declare httpConnection: HttpConnection;

  public declare httpPort: number;

  public declare ipAddress: string;

  private declare isHttpMode: boolean;

  private declare majVersion: number;

  private static MAX_POLL_SPEED: number = 10000;

  private declare messageHandlers: any[];

  private static MIN_POLL_SPEED: number = 0;

  private declare minVersion: number;

  public static readonly MODMSG_TO_ROOM: string = "r";

  public static readonly MODMSG_TO_USER: string = "u";

  public static readonly MODMSG_TO_ZONE: string = "z";

  private static readonly MSG_JSON: string = "{";

  private static MSG_STR: string = "%";

  private static readonly MSG_XML: string = "<";

  public declare myBuddyVars: any[];

  public declare myUserId: number;

  public declare myUserName: string;

  public declare playerId: number;

  public declare port: number;

  public declare properties: any;

  private declare roomList: any[];

  public declare smartConnect: boolean;

  private declare socketConnection: lib.flash.net.Socket;

  private declare subVersion: number;

  private declare sysHandler: SysHandler;

  public static readonly XTMSG_TYPE_JSON: string = "json";

  public static readonly XTMSG_TYPE_STR: string = "str";

  public static readonly XTMSG_TYPE_XML: string = "xml";

  public constructor(debug: boolean = false) {
    super();
    this.autoConnectOnConfigSuccess = false;
    this.httpPort = 8080;
    this.blueBoxPort = 0;
    this.properties = null;
    this.port = 9339;
    this.isHttpMode = false;
    this.smartConnect = true;
    this._httpPollSpeed = SmartFoxClient.DEFAULT_POLL_SPEED;
    this.majVersion = 1;
    this.minVersion = 6;
    this.subVersion = 1;
    this.activeRoomId = -1;
    this.debug = debug;
    this.messageHandlers = [];
    this.setupMessageHandlers();
    this.socketConnection = new lib.flash.net.Socket();
    this.socketConnection.addEventListener(
      lib.flash.events.Event.CONNECT,
      this.handleSocketConnection
    );
    this.socketConnection.addEventListener(
      lib.flash.events.Event.CLOSE,
      this.handleSocketDisconnection
    );
    this.socketConnection.addEventListener(
      lib.flash.events.ProgressEvent.SOCKET_DATA,
      this.handleSocketData
    );
    this.socketConnection.addEventListener(
      lib.flash.events.IOErrorEvent.IO_ERROR,
      this.handleIOError
    );
    this.socketConnection.addEventListener(
      lib.flash.events.IOErrorEvent.NETWORK_ERROR,
      this.handleIOError
    );
    this.socketConnection.addEventListener(
      lib.flash.events.SecurityErrorEvent.SECURITY_ERROR,
      this.handleSecurityError
    );
    this.httpConnection = new HttpConnection();
    this.httpConnection.addEventListener(
      HttpEvent.onHttpConnect,
      this.handleHttpConnect
    );
    this.httpConnection.addEventListener(
      HttpEvent.onHttpClose,
      this.handleHttpClose
    );
    this.httpConnection.addEventListener(
      HttpEvent.onHttpData,
      this.handleHttpData
    );
    this.httpConnection.addEventListener(
      HttpEvent.onHttpError,
      this.handleHttpError
    );
    this.byteBuffer = new lib.flash.utils.ByteArray();
  }

  public __logout(): void {
    this.initialize(true);
  }

  public addBuddy(buddyName: string): void {
    var xmlMsg: any = null;
    if (buddyName != this.myUserName && !this.checkBuddyDuplicates(buddyName)) {
      xmlMsg = "<n>" + buddyName + "</n>";
      this.send({ t: "sys" }, "addB", -1, xmlMsg);
    }
  }

  private addMessageHandler(key: string, handler: IMessageHandler): void {
    if (this.messageHandlers[key] == null) {
      this.messageHandlers[key] = handler;
    } else {
      this.debugMessage(
        "Warning, message handler called: " + key + " already exist!"
      );
    }
  }

  public autoJoin(): void {
    if (!this.checkRoomList()) {
      return;
    }
    var header: any = { t: "sys" };
    this.send(
      header,
      "autoJoin",
      !!this.activeRoomId ? Number(this.activeRoomId) : Number(-1),
      ""
    );
  }

  private checkBuddyDuplicates(buddyName: string): boolean {
    var buddy: any = null;
    var res: boolean = false;
    for (buddy of this.buddyList) {
      if (buddy.name == buddyName) {
        res = true;
        break;
      }
    }
    return res;
  }

  private checkJoin(): boolean {
    var success: boolean = true;
    if (this.activeRoomId < 0) {
      success = false;
      this.errorTrace(
        "You haven't joined any rooms!\nIn order to interact with the server you should join at least one room.\nPlease consult the documentation for more infos."
      );
    }
    return success;
  }

  private checkRoomList(): boolean {
    var success: boolean = true;
    if (this.roomList == null || this.roomList.length == 0) {
      success = false;
      this.errorTrace(
        "The room list is empty!\nThe client API cannot function properly until the room list is populated.\nPlease consult the documentation for more infos."
      );
    }
    return success;
  }

  public clearBuddyList(): void {
    this.buddyList = [];
    this.send({ t: "sys" }, "clearB", -1, "");
    var params: any = {};
    params.list = this.buddyList;
    var evt: SFSEvent = new SFSEvent(SFSEvent.onBuddyList, params);
    this.dispatchEvent(evt);
  }

  public clearRoomList(): void {
    this.roomList = [];
  }

  private closeHeader(): string {
    return "</msg>";
  }

  public connect(ipAdr: string, port: number = 9339): void {
    if (!this.connected) {
      this.initialize();
      this.ipAddress = ipAdr;
      this.port = port;
      this.socketConnection.connect(ipAdr, port);
    } else {
      this.debugMessage("*** ALREADY CONNECTED ***");
    }
  }

  public createRoom(roomObj: any, roomId: number = -1): void {
    var i: any = null;
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    var header: any = { t: "sys" };
    var isGame: string = !!roomObj.isGame ? "1" : "0";
    var exitCurrentRoom: string = "1";
    var maxUsers: string =
      roomObj.maxUsers == null ? "0" : String(roomObj.maxUsers);
    var maxSpectators: string =
      roomObj.maxSpectators == null ? "0" : String(roomObj.maxSpectators);
    var joinAsSpectator: string = !!roomObj.joinAsSpectator ? "1" : "0";
    if (roomObj.isGame && roomObj.exitCurrentRoom != null) {
      exitCurrentRoom = !!roomObj.exitCurrentRoom ? "1" : "0";
    }
    var xmlMsg: any =
      "<room tmp='1' gam='" +
      isGame +
      "' spec='" +
      maxSpectators +
      "' exit='" +
      exitCurrentRoom +
      "' jas='" +
      joinAsSpectator +
      "'>";
    xmlMsg =
      xmlMsg +
      ("<name><![CDATA[" +
        (roomObj.name == null ? "" : roomObj.name) +
        "]]></name>");
    xmlMsg =
      xmlMsg +
      ("<pwd><![CDATA[" +
        (roomObj.password == null ? "" : roomObj.password) +
        "]]></pwd>");
    xmlMsg = xmlMsg + ("<max>" + maxUsers + "</max>");
    if (roomObj.uCount != null) {
      xmlMsg = xmlMsg + ("<uCnt>" + (!!roomObj.uCount ? "1" : "0") + "</uCnt>");
    }
    if (roomObj.extension != null) {
      xmlMsg = xmlMsg + ("<xt n='" + roomObj.extension.name);
      xmlMsg = xmlMsg + ("' s='" + roomObj.extension.script + "' />");
    }
    if (roomObj.vars == null) {
      xmlMsg = xmlMsg + "<vars></vars>";
    } else {
      xmlMsg = xmlMsg + "<vars>";
      for (i in roomObj.vars) {
        xmlMsg = xmlMsg + this.getXmlRoomVariable(roomObj.vars[i]);
      }
      xmlMsg = xmlMsg + "</vars>";
    }
    xmlMsg = xmlMsg + "</room>";
    this.send(header, "createRoom", roomId, xmlMsg);
  }

  private debugMessage(message: string): void {
    var evt: any = null;
    if (this.debug) {
      lib.__internal.avm2.Runtime.trace(message);
      evt = new SFSEvent(SFSEvent.onDebugMessage, { message: message });
      this.dispatchEvent(evt);
    }
  }

  public disconnect(): void {
    this.connected = false;
    if (!this.isHttpMode) {
      this.socketConnection.close();
    } else {
      this.httpConnection.close();
    }
    this.sysHandler.dispatchDisconnection();
  }

  private dispatchConnectionError(): void {
    var params: any = {};
    params.success = false;
    params.error = "I/O Error";
    var sfse: SFSEvent = new SFSEvent(SFSEvent.onConnection, params);
    this.dispatchEvent(sfse);
  }

  private errorTrace(msg: string): void {
    lib.__internal.avm2.Runtime.trace(
      "\n****************************************************************"
    );
    lib.__internal.avm2.Runtime.trace("Warning:");
    lib.__internal.avm2.Runtime.trace(msg);
    lib.__internal.avm2.Runtime.trace(
      "****************************************************************"
    );
  }

  public getActiveRoom(): Room {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return null;
    }
    return this.roomList[this.activeRoomId];
  }

  public getAllRooms(): any[] {
    return this.roomList;
  }

  public getBenchStartTime(): number {
    return this.benchStartTime;
  }

  public getBuddyById(id: number): any {
    var buddy: any = null;
    for (buddy of this.buddyList) {
      if (buddy.id == id) {
        return buddy;
      }
    }
    return null;
  }

  public getBuddyByName(buddyName: string): any {
    var buddy: any = null;
    for (buddy of this.buddyList) {
      if (buddy.name == buddyName) {
        return buddy;
      }
    }
    return null;
  }

  public getBuddyRoom(buddy: any): void {
    if (buddy.id != -1) {
      this.send({ t: "sys" }, "roomB", -1, "<b id='" + buddy.id + "' />");
    }
  }

  public getConnectionMode(): string {
    var mode: string = SmartFoxClient.CONNECTION_MODE_DISCONNECTED;
    if (this.isConnected) {
      if (this.isHttpMode) {
        mode = SmartFoxClient.CONNECTION_MODE_HTTP;
      } else {
        mode = SmartFoxClient.CONNECTION_MODE_SOCKET;
      }
    }
    return mode;
  }

  public getRandomKey(): void {
    this.send({ t: "sys" }, "rndK", -1, "");
  }

  public getRoom(roomId: number): Room {
    if (!this.checkRoomList()) {
      return null;
    }
    return this.roomList[roomId];
  }

  public getRoomByName(roomName: string): Room {
    var r: any = null;
    if (!this.checkRoomList()) {
      return null;
    }
    var room: any = null;
    for (r of this.roomList) {
      if (r.getName() == roomName) {
        room = r;
        break;
      }
    }
    return room;
  }

  public getRoomList(): void {
    var header: any = { t: "sys" };
    this.send(header, "getRmList", this.activeRoomId, "");
  }

  public getUploadPath(): string {
    return (
      "http://" + this.ipAddress + ":" + this.httpPort + "/default/uploads/"
    );
  }

  public getVersion(): string {
    return this.majVersion + "." + this.minVersion + "." + this.subVersion;
  }

  private getXmlRoomVariable(rVar: any): string {
    var vName: string = rVar.name.toString();
    var vValue: any = rVar.val;
    var vPrivate: string = !!rVar.priv ? "1" : "0";
    var vPersistent: string = !!rVar.persistent ? "1" : "0";
    var t: any = null;
    var type: any = typeof vValue;
    if (type == "boolean") {
      t = "b";
      vValue = !!vValue ? "1" : "0";
    } else if (type == "number") {
      t = "n";
    } else if (type == "string") {
      t = "s";
    } else if ((vValue == null && type == "object") || type == "undefined") {
      t = "x";
      vValue = "";
    }
    if (t != null) {
      return (
        "<var n='" +
        vName +
        "' t='" +
        t +
        "' pr='" +
        vPrivate +
        "' pe='" +
        vPersistent +
        "'><![CDATA[" +
        vValue +
        "]]></var>"
      );
    }
    return "";
  }

  private getXmlUserVariable(uVars: any): string {
    var val: any = undefined;
    var t: any = null;
    var type: any = null;
    var key: any = null;
    var xmlStr: any = "<vars>";
    for (key in uVars) {
      val = uVars[key];
      type = typeof val;
      t = null;
      if (type == "boolean") {
        t = "b";
        val = !!val ? "1" : "0";
      } else if (type == "number") {
        t = "n";
      } else if (type == "string") {
        t = "s";
      } else if ((val == null && type == "object") || type == "undefined") {
        t = "x";
        val = "";
      }
      if (t != null) {
        xmlStr =
          xmlStr +
          ("<var n='" + key + "' t='" + t + "'><![CDATA[" + val + "]]></var>");
      }
    }
    xmlStr = xmlStr + "</vars>";
    return xmlStr;
  }

  private handleDelayedPoll(): void {
    this.httpConnection.send(SmartFoxClient.HTTP_POLL_REQUEST);
  }

  private handleHttpClose(evt: HttpEvent): void {
    this.initialize();
    var sfse: SFSEvent = new SFSEvent(SFSEvent.onConnectionLost, {});
    this.dispatchEvent(sfse);
  }

  private handleHttpConnect(evt: HttpEvent): void {
    this.handleSocketConnection(null);
    this.connected = true;
    this.httpConnection.send(SmartFoxClient.HTTP_POLL_REQUEST);
  }

  private handleHttpData(evt: HttpEvent): void {
    var message: any = null;
    var i: number = 0;
    var data: string = evt.params.data as string;
    var messages: any[] = data.split("\n");
    if (messages[0] != "") {
      for (i = 0; i < messages.length - 1; i++) {
        message = messages[i];
        if (message.length > 0) {
          this.handleMessage(message);
        }
      }
      if (this._httpPollSpeed > 0) {
        lib.flash.utils.setTimeout(this.handleDelayedPoll, this._httpPollSpeed);
      } else {
        this.handleDelayedPoll();
      }
    }
  }

  private handleHttpError(evt: HttpEvent): void {
    lib.__internal.avm2.Runtime.trace("HttpError");
    if (!this.connected) {
      this.dispatchConnectionError();
    }
  }

  private handleIOError(evt: lib.flash.events.IOErrorEvent): void {
    this.tryBlueBoxConnection(evt);
  }

  private handleMessage(msg: string): void {
    if (msg != "ok") {
      this.debugMessage("[ RECEIVED ]: " + msg + ", (len: " + msg.length + ")");
    }
    var type: string = msg.charAt(0);
    if (type == SmartFoxClient.MSG_XML) {
      this.xmlReceived(msg);
    } else if (type == SmartFoxClient.MSG_STR) {
      this.strReceived(msg);
    } else if (type == SmartFoxClient.MSG_JSON) {
      this.jsonReceived(msg);
    }
  }

  private handleSecurityError(evt: lib.flash.events.SecurityErrorEvent): void {
    this.tryBlueBoxConnection(evt);
  }

  private handleSocketConnection(e: lib.flash.events.Event): void {
    var header: any = { t: "sys" };
    var xmlMsg: any =
      "<ver v='" +
      this.majVersion.toString() +
      this.minVersion.toString() +
      this.subVersion.toString() +
      "' />";
    this.send(header, "verChk", 0, xmlMsg);
  }

  private handleSocketData(evt: lib.flash.events.Event): void {
    var b: number = 0;
    var bytes: number = this.socketConnection.bytesAvailable;
    while (--bytes >= 0) {
      b = this.socketConnection.readByte();
      if (b != 0) {
        this.byteBuffer.writeByte(b);
      } else {
        this.handleMessage(this.byteBuffer.toString());
        this.byteBuffer = new lib.flash.utils.ByteArray();
      }
    }
  }

  private handleSocketDisconnection(evt: lib.flash.events.Event): void {
    this.initialize();
    var sfse: SFSEvent = new SFSEvent(SFSEvent.onConnectionLost, {});
    this.dispatchEvent(sfse);
  }

  private handleSocketError(evt: lib.flash.events.SecurityErrorEvent): void {
    this.debugMessage("Socket Error: " + evt.text);
  }

  public get httpPollSpeed(): number {
    return this._httpPollSpeed;
  }

  public set httpPollSpeed(sp: number) {
    if (sp >= 0 && sp <= 10000) {
      this._httpPollSpeed = sp;
    }
  }

  private initialize(isLogOut: boolean = false): void {
    this.changingRoom = false;
    this.amIModerator = false;
    this.playerId = -1;
    this.activeRoomId = -1;
    this.myUserId = -1;
    this.myUserName = "";
    this.roomList = [];
    this.buddyList = [];
    this.myBuddyVars = [];
    if (!isLogOut) {
      this.connected = false;
      this.isHttpMode = false;
    }
  }

  public get isConnected(): boolean {
    return this.connected;
  }

  public set isConnected(b: boolean) {
    this.connected = b;
  }

  public joinRoom(
    newRoom: any,
    pword: string = "",
    isSpectator: boolean = false,
    dontLeave: boolean = false,
    oldRoom: number = -1
  ): void {
    var r: any = null;
    var header: any = null;
    var leaveCurrRoom: any = null;
    var roomToLeave: number = 0;
    var message: any = null;
    if (!this.checkRoomList()) {
      return;
    }
    var newRoomId: number = -1;
    var isSpec: number = !!isSpectator ? 1 : 0;
    if (!this.changingRoom) {
      if (typeof newRoom == "number") {
        newRoomId = lib.__internal.avm2.Runtime.int(newRoom);
      } else if (typeof newRoom == "string") {
        for (r of this.roomList) {
          if (r.getName() == newRoom) {
            newRoomId = r.getId();
            break;
          }
        }
      }
      if (newRoomId != -1) {
        header = { t: "sys" };
        leaveCurrRoom = !!dontLeave ? "0" : "1";
        roomToLeave =
          oldRoom > -1
            ? lib.__internal.avm2.Runtime.int(oldRoom)
            : lib.__internal.avm2.Runtime.int(this.activeRoomId);
        if (this.activeRoomId == -1) {
          leaveCurrRoom = "0";
          roomToLeave = -1;
        }
        message =
          "<room id='" +
          newRoomId +
          "' pwd='" +
          pword +
          "' spec='" +
          isSpec +
          "' leave='" +
          leaveCurrRoom +
          "' old='" +
          roomToLeave +
          "' />";
        this.send(header, "joinRoom", this.activeRoomId, message);
        this.changingRoom = true;
      } else {
        this.debugMessage(
          "SmartFoxError: requested room to join does not exist!"
        );
      }
    }
  }

  private jsonReceived(msg: string): void {
    var jso: any = this.com.adobe.serialization.json.JSON.decode(msg);
    var handlerId: string = jso["t"];
    var handler: IMessageHandler = this.messageHandlers[handlerId];
    if (handler != null) {
      handler.handleMessage(jso["b"], SmartFoxClient.XTMSG_TYPE_JSON);
    }
  }

  public leaveRoom(roomId: number): void {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    var header: any = { t: "sys" };
    var xmlMsg: any = "<rm id='" + roomId + "' />";
    this.send(header, "leaveRoom", roomId, xmlMsg);
  }

  public loadBuddyList(): void {
    this.send({ t: "sys" }, "loadB", -1, "");
  }

  public loadConfig(
    configFile: string = "config.xml",
    autoConnect: boolean = true
  ): void {
    this.autoConnectOnConfigSuccess = autoConnect;
    var loader: lib.flash.net.URLLoader = new lib.flash.net.URLLoader();
    loader.addEventListener(
      lib.flash.events.Event.COMPLETE,
      this.onConfigLoadSuccess
    );
    loader.addEventListener(
      lib.flash.events.IOErrorEvent.IO_ERROR,
      this.onConfigLoadFailure
    );
    loader.load(new lib.flash.net.URLRequest(configFile));
  }

  public login(zone: string, name: string, pass: string): void {
    var header: any = { t: "sys" };
    var message: any =
      "<login z='" +
      zone +
      "'><nick><![CDATA[" +
      name +
      "]]></nick><pword><![CDATA[" +
      pass +
      "]]></pword></login>";
    this.send(header, "login", 0, message);
  }

  public logout(): void {
    var header: any = { t: "sys" };
    this.send(header, "logout", -1, "");
  }

  private makeXmlHeader(headerObj: any): string {
    var item: any = null;
    var xmlData: any = "<msg";
    for (item in headerObj) {
      xmlData = xmlData + (" " + item + "='" + headerObj[item] + "'");
    }
    xmlData = xmlData + ">";
    return xmlData;
  }

  private onConfigLoadFailure(evt: lib.flash.events.IOErrorEvent): void {
    var params: any = { message: evt.text };
    var sfsEvt: SFSEvent = new SFSEvent(SFSEvent.onConfigLoadFailure, params);
    this.dispatchEvent(sfsEvt);
  }

  private onConfigLoadSuccess(evt: lib.flash.events.Event): void {
    var sfsEvt: any = null;
    var loader: lib.flash.net.URLLoader = evt.target as lib.flash.net.URLLoader;
    var xmlDoc: lib.__internal.avm2.XML = new lib.__internal.avm2.XML(
      loader.data
    );
    this.ipAddress = this.blueBoxIpAddress = xmlDoc.ip;
    this.port = lib.__internal.avm2.Runtime.int(xmlDoc.port);
    this.defaultZone = xmlDoc.zone;
    if (xmlDoc.blueBoxIpAddress != undefined) {
      this.blueBoxIpAddress = xmlDoc.blueBoxIpAddress;
    }
    if (xmlDoc.blueBoxPort != undefined) {
      this.blueBoxPort = xmlDoc.blueBoxPort;
    }
    if (xmlDoc.debug != undefined) {
      this.debug = xmlDoc.debug.toLowerCase() == "true" ? true : false;
    }
    if (xmlDoc.smartConnect != undefined) {
      this.smartConnect =
        xmlDoc.smartConnect.toLowerCase() == "true" ? true : false;
    }
    if (xmlDoc.httpPort != undefined) {
      this.httpPort = lib.__internal.avm2.Runtime.int(xmlDoc.httpPort);
    }
    if (xmlDoc.httpPollSpeed != undefined) {
      this.httpPollSpeed = lib.__internal.avm2.Runtime.int(
        xmlDoc.httpPollSpeed
      );
    }
    if (xmlDoc.rawProtocolSeparator != undefined) {
      this.rawProtocolSeparator = xmlDoc.rawProtocolSeparator;
    }
    if (this.autoConnectOnConfigSuccess) {
      this.connect(this.ipAddress, this.port);
    } else {
      sfsEvt = new SFSEvent(SFSEvent.onConfigLoadSuccess, {});
      this.dispatchEvent(sfsEvt);
    }
  }

  public get rawProtocolSeparator(): string {
    return SmartFoxClient.MSG_STR;
  }

  public set rawProtocolSeparator(value: string) {
    if (value != "<" && value != "{") {
      SmartFoxClient.MSG_STR = value;
    }
  }

  public removeBuddy(buddyName: string): void {
    var buddy: any = null;
    var it: any = null;
    var header: any = null;
    var xmlMsg: any = null;
    var params: any = null;
    var evt: any = null;
    var found: boolean = false;
    for (it in this.buddyList) {
      buddy = this.buddyList[it];
      if (buddy.name == buddyName) {
        delete this.buddyList[it];
        found = true;
        break;
      }
    }
    if (found) {
      header = { t: "sys" };
      xmlMsg = "<n>" + buddyName + "</n>";
      this.send(header, "remB", -1, xmlMsg);
      params = {};
      params.list = this.buddyList;
      evt = new SFSEvent(SFSEvent.onBuddyList, params);
      this.dispatchEvent(evt);
    }
  }

  public roundTripBench(): void {
    this.benchStartTime = lib.flash.utils.getTimer();
    this.send({ t: "sys" }, "roundTrip", this.activeRoomId, "");
  }

  private send(
    header: any,
    action: string,
    fromRoom: number,
    message: string
  ): void {
    var xmlMsg: string = this.makeXmlHeader(header);
    xmlMsg =
      xmlMsg +
      ("<body action='" +
        action +
        "' r='" +
        fromRoom +
        "'>" +
        message +
        "</body>" +
        this.closeHeader());
    this.debugMessage("[Sending]: " + xmlMsg + "\n");
    if (this.isHttpMode) {
      this.httpConnection.send(xmlMsg);
    } else {
      this.writeToSocket(xmlMsg);
    }
  }

  public sendBuddyPermissionResponse(
    allowBuddy: boolean,
    targetBuddy: string
  ): void {
    var header: any = { t: "sys" };
    var xmlMsg: any =
      "<n res='" + (!!allowBuddy ? "g" : "r") + "'>" + targetBuddy + "</n>";
    this.send(header, "bPrm", -1, xmlMsg);
  }

  public sendJson(jsMessage: string): void {
    this.debugMessage("[Sending - JSON]: " + jsMessage + "\n");
    if (this.isHttpMode) {
      this.httpConnection.send(jsMessage);
    } else {
      this.writeToSocket(jsMessage);
    }
  }

  public sendModeratorMessage(
    message: string,
    type: string,
    id: number = -1
  ): void {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    var header: any = { t: "sys" };
    var xmlMsg: any =
      "<txt t='" +
      type +
      "' id='" +
      id +
      "'><![CDATA[" +
      Entities.encodeEntities(message) +
      "]]></txt>";
    this.send(header, "modMsg", this.activeRoomId, xmlMsg);
  }

  public sendObject(obj: any, roomId: number = -1): void {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    var xmlData: any =
      "<![CDATA[" + ObjectSerializer.getInstance().serialize(obj) + "]]>";
    var header: any = { t: "sys" };
    this.send(header, "asObj", roomId, xmlData);
  }

  public sendObjectToGroup(
    obj: any,
    userList: any[],
    roomId: number = -1
  ): void {
    var i: any = null;
    var header: any = null;
    var xmlMsg: any = null;
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    var strList: string = "";
    for (i in userList) {
      if (!isNaN(userList[i])) {
        strList = strList + (userList[i] + ",");
      }
    }
    strList = strList.substr(0, strList.length - 1);
    obj._$$_ = strList;
    header = { t: "sys" };
    xmlMsg =
      "<![CDATA[" + ObjectSerializer.getInstance().serialize(obj) + "]]>";
    this.send(header, "asObjG", roomId, xmlMsg);
  }

  public sendPrivateMessage(
    message: string,
    recipientId: number,
    roomId: number = -1
  ): void {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    var header: any = { t: "sys" };
    var xmlMsg: any =
      "<txt rcp='" +
      recipientId +
      "'><![CDATA[" +
      Entities.encodeEntities(message) +
      "]]></txt>";
    this.send(header, "prvMsg", roomId, xmlMsg);
  }

  public sendPublicMessage(message: string, roomId: number = -1): void {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    var header: any = { t: "sys" };
    var xmlMsg: any =
      "<txt><![CDATA[" + Entities.encodeEntities(message) + "]]></txt>";
    this.send(header, "pubMsg", roomId, xmlMsg);
  }

  public sendString(strMessage: string): void {
    this.debugMessage("[Sending - STR]: " + strMessage + "\n");
    if (this.isHttpMode) {
      this.httpConnection.send(strMessage);
    } else {
      this.writeToSocket(strMessage);
    }
  }

  public sendXtMessage(
    xtName: string,
    cmd: string,
    paramObj: any,
    type: string = "xml",
    roomId: number = -1
  ): void {
    var header: any = null;
    var xtReq: any = null;
    var xmlmsg: any = null;
    var hdr: any = null;
    var i: any = NaN;
    var body: any = null;
    var obj: any = null;
    var msg: any = null;
    if (!this.checkRoomList()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    if (type == SmartFoxClient.XTMSG_TYPE_XML) {
      header = { t: "xt" };
      xtReq = { name: xtName, cmd: cmd, param: paramObj };
      xmlmsg =
        "<![CDATA[" + ObjectSerializer.getInstance().serialize(xtReq) + "]]>";
      this.send(header, "xtReq", roomId, xmlmsg);
    } else if (type == SmartFoxClient.XTMSG_TYPE_STR) {
      hdr =
        SmartFoxClient.MSG_STR +
        "xt" +
        SmartFoxClient.MSG_STR +
        xtName +
        SmartFoxClient.MSG_STR +
        cmd +
        SmartFoxClient.MSG_STR +
        roomId +
        SmartFoxClient.MSG_STR;
      for (i = 0; i < paramObj.length; i++) {
        hdr = hdr + (paramObj[i].toString() + SmartFoxClient.MSG_STR);
      }
      this.sendString(hdr);
    } else if (type == SmartFoxClient.XTMSG_TYPE_JSON) {
      body = {};
      body.x = xtName;
      body.c = cmd;
      body.r = roomId;
      body.p = paramObj;
      obj = {};
      obj.t = "xt";
      obj.b = body;
      msg = this.com.adobe.serialization.json.JSON.encode(obj);
      this.sendJson(msg);
    }
  }

  public setBuddyBlockStatus(buddyName: string, status: boolean): void {
    var xmlMsg: any = null;
    var params: any = null;
    var evt: any = null;
    var b: any = this.getBuddyByName(buddyName);
    if (b != null) {
      if (b.isBlocked != status) {
        b.isBlocked = status;
        xmlMsg = "<n x='" + (!!status ? "1" : "0") + "'>" + buddyName + "</n>";
        this.send({ t: "sys" }, "setB", -1, xmlMsg);
        params = {};
        params.buddy = b;
        evt = new SFSEvent(SFSEvent.onBuddyListUpdate, params);
        this.dispatchEvent(evt);
      }
    }
  }

  public setBuddyVariables(varList: any[]): void {
    var vName: any = null;
    var vValue: any = null;
    var header: any = { t: "sys" };
    var xmlMsg: any = "<vars>";
    for (vName in varList) {
      vValue = varList[vName];
      if (this.myBuddyVars[vName] != vValue) {
        this.myBuddyVars[vName] = vValue;
        xmlMsg =
          xmlMsg + ("<var n='" + vName + "'><![CDATA[" + vValue + "]]></var>");
      }
    }
    xmlMsg = xmlMsg + "</vars>";
    this.send(header, "setBvars", -1, xmlMsg);
  }

  public setRoomVariables(
    varList: any[],
    roomId: number = -1,
    setOwnership: boolean = true
  ): void {
    var xmlMsg: any = null;
    var rv: any = null;
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    var header: any = { t: "sys" };
    if (setOwnership) {
      xmlMsg = "<vars>";
    } else {
      xmlMsg = "<vars so='0'>";
    }
    for (rv of varList) {
      xmlMsg = xmlMsg + this.getXmlRoomVariable(rv);
    }
    xmlMsg = xmlMsg + "</vars>";
    this.send(header, "setRvars", roomId, xmlMsg);
  }

  private setupMessageHandlers(): void {
    this.sysHandler = new SysHandler(this);
    this.extHandler = new ExtHandler(this);
    this.addMessageHandler("sys", this.sysHandler);
    this.addMessageHandler("xt", this.extHandler);
  }

  public setUserVariables(varObj: any, roomId: number = -1): void {
    var room: any = null;
    var xmlMsg: any = null;
    var varOwner: any = undefined;
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    var header: any = { t: "sys" };
    var currRoom: Room = this.getActiveRoom();
    var user: User = currRoom.getUser(this.myUserId);
    user.setVariables(varObj);
    var userId: number = user.getId();
    for (room of this.getAllRooms()) {
      varOwner = room.getUser(userId);
      if (varOwner != null && varOwner != user) {
        varOwner.setVariables(varObj);
      }
    }
    xmlMsg = this.getXmlUserVariable(varObj);
    this.send(header, "setUvars", roomId, xmlMsg);
  }

  private strReceived(msg: string): void {
    var params: any[] = msg
      .substr(1, msg.length - 2)
      .split(SmartFoxClient.MSG_STR);
    var handlerId: string = params[0];
    var handler: IMessageHandler = this.messageHandlers[handlerId];
    if (handler != null) {
      handler.handleMessage(
        params.splice(1, params.length - 1),
        SmartFoxClient.XTMSG_TYPE_STR
      );
    }
  }

  public switchPlayer(roomId: number = -1): void {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    this.send({ t: "sys" }, "swPl", roomId, "");
  }

  public switchSpectator(roomId: number = -1): void {
    if (!this.checkRoomList() || !this.checkJoin()) {
      return;
    }
    if (roomId == -1) {
      roomId = this.activeRoomId;
    }
    this.send({ t: "sys" }, "swSpec", roomId, "");
  }

  private tryBlueBoxConnection(evt: lib.flash.events.ErrorEvent): void {
    var __ip: any = null;
    var __port: number = 0;
    if (!this.connected) {
      if (this.smartConnect) {
        this.debugMessage("Socket connection failed. Trying BlueBox");
        this.isHttpMode = true;
        __ip =
          this.blueBoxIpAddress != null
            ? this.blueBoxIpAddress
            : this.ipAddress;
        __port =
          this.blueBoxPort != 0
            ? lib.__internal.avm2.Runtime.int(this.blueBoxPort)
            : lib.__internal.avm2.Runtime.int(this.httpPort);
        this.httpConnection.connect(__ip, __port);
      } else {
        this.dispatchConnectionError();
      }
    } else {
      this.debugMessage("[WARN] Connection error: " + evt.text);
    }
  }

  public uploadFile(
    fileRef: lib.flash.net.FileReference,
    id: number = -1,
    nick: string = "",
    port: number = -1
  ): void {
    if (id == -1) {
      id = this.myUserId;
    }
    if (nick == "") {
      nick = this.myUserName;
    }
    if (port == -1) {
      port = this.httpPort;
    }
    fileRef.upload(
      new lib.flash.net.URLRequest(
        "http://" +
          this.ipAddress +
          ":" +
          port +
          "/default/Upload.py?id=" +
          id +
          "&nick=" +
          nick
      )
    );
    this.debugMessage(
      "[UPLOAD]: http://" +
        this.ipAddress +
        ":" +
        port +
        "/default/Upload.py?id=" +
        id +
        "&nick=" +
        nick
    );
  }

  private writeToSocket(msg: string): void {
    var byteBuff: lib.flash.utils.ByteArray = new lib.flash.utils.ByteArray();
    byteBuff.writeUTFBytes(msg);
    byteBuff.writeByte(0);
    this.socketConnection.writeBytes(byteBuff);
    this.socketConnection.flush();
  }

  private xmlReceived(msg: string): void {
    var xmlData: lib.__internal.avm2.XML = new lib.__internal.avm2.XML(msg);
    var handlerId: string = xmlData.t;
    var action: string = xmlData.body.action;
    var roomId: number = xmlData.body.r;
    var handler: IMessageHandler = this.messageHandlers[handlerId];
    if (handler != null) {
      handler.handleMessage(xmlData, SmartFoxClient.XTMSG_TYPE_XML);
    }
  }
}
