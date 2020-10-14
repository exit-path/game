import lib from "swf-lib";
import { IMessageHandler } from "./IMessageHandler";
import { SmartFoxClient } from "../SmartFoxClient";
import { ObjectSerializer } from "../util/ObjectSerializer";
import { SFSEvent } from "../SFSEvent";

export class ExtHandler implements IMessageHandler {
  static readonly [IMessageHandler.__IMPL] = true;
  private declare sfs: SmartFoxClient;

  public constructor(sfs: SmartFoxClient) {
    this.sfs = sfs;
  }

  public handleMessage(msgObj: any, type: string): void {
    var params: any = null;
    var evt: any = null;
    var xmlData: any = null;
    var action: any = null;
    var roomId: number = 0;
    var xmlStr: any = null;
    var asObj: any = null;
    if (type == SmartFoxClient.XTMSG_TYPE_XML) {
      xmlData = msgObj as lib.__internal.avm2.XML;
      action = xmlData.body.action;
      roomId = lib.__internal.avm2.Runtime.int(xmlData.body.id);
      if (action == "xtRes") {
        xmlStr = xmlData.body.toString();
        asObj = ObjectSerializer.getInstance().deserialize(xmlStr);
        params = {};
        params.dataObj = asObj;
        params.type = type;
        evt = new SFSEvent(SFSEvent.onExtensionResponse, params);
        this.sfs.dispatchEvent(evt);
      }
    } else if (type == SmartFoxClient.XTMSG_TYPE_JSON) {
      params = {};
      params.dataObj = msgObj.o;
      params.type = type;
      evt = new SFSEvent(SFSEvent.onExtensionResponse, params);
      this.sfs.dispatchEvent(evt);
    } else if (type == SmartFoxClient.XTMSG_TYPE_STR) {
      params = {};
      params.dataObj = msgObj;
      params.type = type;
      evt = new SFSEvent(SFSEvent.onExtensionResponse, params);
      this.sfs.dispatchEvent(evt);
    }
  }
}
