import lib from "swf-lib";

export class SFSEvent extends lib.flash.events.Event {
  public static readonly onAdminMessage: string = "onAdminMessage";

  public static readonly onBuddyList: string = "onBuddyList";

  public static readonly onBuddyListError: string = "onBuddyListError";

  public static readonly onBuddyListUpdate: string = "onBuddyListUpdate";

  public static readonly onBuddyPermissionRequest: string =
    "onBuddyPermissionRequest";

  public static readonly onBuddyRoom: string = "onBuddyRoom";

  public static readonly onConfigLoadFailure: string = "onConfigLoadFailure";

  public static readonly onConfigLoadSuccess: string = "onConfigLoadSuccess";

  public static readonly onConnection: string = "onConnection";

  public static readonly onConnectionLost: string = "onConnectionLost";

  public static readonly onCreateRoomError: string = "onCreateRoomError";

  public static readonly onDebugMessage: string = "onDebugMessage";

  public static readonly onExtensionResponse: string = "onExtensionResponse";

  public static readonly onJoinRoom: string = "onJoinRoom";

  public static readonly onJoinRoomError: string = "onJoinRoomError";

  public static readonly onLogin: string = "onLogin";

  public static readonly onLogout: string = "onLogout";

  public static readonly onModeratorMessage: string = "onModMessage";

  public static readonly onObjectReceived: string = "onObjectReceived";

  public static readonly onPlayerSwitched: string = "onPlayerSwitched";

  public static readonly onPrivateMessage: string = "onPrivateMessage";

  public static readonly onPublicMessage: string = "onPublicMessage";

  public static readonly onRandomKey: string = "onRandomKey";

  public static readonly onRoomAdded: string = "onRoomAdded";

  public static readonly onRoomDeleted: string = "onRoomDeleted";

  public static readonly onRoomLeft: string = "onRoomLeft";

  public static readonly onRoomListUpdate: string = "onRoomListUpdate";

  public static readonly onRoomVariablesUpdate: string =
    "onRoomVariablesUpdate";

  public static readonly onRoundTripResponse: string = "onRoundTripResponse";

  public static readonly onSpectatorSwitched: string = "onSpectatorSwitched";

  public static readonly onUserCountChange: string = "onUserCountChange";

  public static readonly onUserEnterRoom: string = "onUserEnterRoom";

  public static readonly onUserLeaveRoom: string = "onUserLeaveRoom";

  public static readonly onUserVariablesUpdate: string =
    "onUserVariablesUpdate";

  public declare params: any;

  public constructor(type: string, params: any) {
    super(type);
    this.params = params;
  }

  public clone(): lib.flash.events.Event {
    return new SFSEvent(this.type, this.params);
  }

  public toString(): string {
    return this.formatToString(
      "SFSEvent",
      "type",
      "bubbles",
      "cancelable",
      "eventPhase",
      "params"
    );
  }
}
