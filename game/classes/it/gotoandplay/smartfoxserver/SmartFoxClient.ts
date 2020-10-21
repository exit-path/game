import lib from "swf-lib";

export class SmartFoxClient extends lib.flash.events.EventDispatcher {
  public declare isConnected: boolean;

  public declare debug: boolean;

  public declare myUserId: number;

  public declare myUserName: string;

  public constructor(debug: boolean = false) {
    super();
  }

  public connect(ipAdr: string, port: number = 9339): void {}

  public createRoom(roomObj: any, roomId: number = -1): void {}

  public disconnect(): void {}

  public getActiveRoom(): unknown {
    return null;
  }

  public getAllRooms(): any[] {
    return [];
  }

  public getRoomList(): void {}

  public joinRoom(
    newRoom: any,
    pword: string = "",
    isSpectator: boolean = false,
    dontLeave: boolean = false,
    oldRoom: number = -1
  ): void {}

  public login(zone: string, name: string, pass: string): void {}

  public roundTripBench(): void {}

  public sendPrivateMessage(
    message: string,
    recipientId: number,
    roomId: number = -1
  ): void {}

  public sendPublicMessage(message: string, roomId: number = -1): void {}

  public setRoomVariables(
    varList: any[],
    roomId: number = -1,
    setOwnership: boolean = true
  ): void {}

  public setUserVariables(varObj: any, roomId: number = -1): void {}
}
