import lib from "swf-lib";
import { Entities } from "./Entities";

export class ObjectSerializer {
  private declare debug: boolean;

  private declare eof: string;

  private declare static instance: ObjectSerializer;

  private declare tabs: string;

  public constructor(debug: boolean = false) {
    this.tabs = "\t\t\t\t\t\t\t\t\t\t\t\t\t";
    this.setDebug(debug);
  }

  public deserialize(xmlString: string): any {
    var xmlData: lib.__internal.avm2.XML = new lib.__internal.avm2.XML(
      xmlString
    );
    var resObj: any = {};
    this.xml2obj(xmlData, resObj);
    return resObj;
  }

  private encodeEntities(s: string): string {
    return s;
  }

  public static getInstance(debug: boolean = false): ObjectSerializer {
    if (ObjectSerializer.instance == null) {
      ObjectSerializer.instance = new ObjectSerializer(debug);
    }
    return ObjectSerializer.instance;
  }

  private obj2xml(
    srcObj: any,
    trgObj: any,
    depth: number = 0,
    objName: string = ""
  ): void {
    var i: any = null;
    var ot: any = null;
    var t: any = null;
    var o: any = undefined;
    if (depth == 0) {
      trgObj.xmlStr = "<dataObj>" + this.eof;
    } else {
      if (this.debug) {
        trgObj.xmlStr = trgObj.xmlStr + this.tabs.substr(0, depth);
      }
      ot = Array.isArray(srcObj) ? "a" : "o";
      trgObj.xmlStr =
        trgObj.xmlStr + ("<obj t='" + ot + "' o='" + objName + "'>" + this.eof);
    }
    for (i in srcObj) {
      t = typeof srcObj[i];
      o = srcObj[i];
      if (t == "boolean" || t == "number" || t == "string" || t == "null") {
        if (t == "boolean") {
          o = Number(o);
        } else if (t == "null") {
          t = "x";
          o = "";
        } else if (t == "string") {
          o = Entities.encodeEntities(o);
        }
        if (this.debug) {
          trgObj.xmlStr = trgObj.xmlStr + this.tabs.substr(0, depth + 1);
        }
        trgObj.xmlStr =
          trgObj.xmlStr +
          ("<var n='" +
            i +
            "' t='" +
            t.substr(0, 1) +
            "'>" +
            o +
            "</var>" +
            this.eof);
      } else if (t == "object") {
        this.obj2xml(o, trgObj, depth + 1, i);
        if (this.debug) {
          trgObj.xmlStr = trgObj.xmlStr + this.tabs.substr(0, depth + 1);
        }
        trgObj.xmlStr = trgObj.xmlStr + ("</obj>" + this.eof);
      }
    }
    if (depth == 0) {
      trgObj.xmlStr = trgObj.xmlStr + ("</dataObj>" + this.eof);
    }
  }

  public serialize(o: any): string {
    var result: any = {};
    this.obj2xml(o, result);
    return result.xmlStr;
  }

  private setDebug(b: boolean): void {
    this.debug = b;
    if (this.debug) {
      this.eof = "\n";
    } else {
      this.eof = "";
    }
  }

  private xml2obj(x: lib.__internal.avm2.XML, o: any): void {
    var nodeName: any = null;
    var node: any = null;
    var objName: any = null;
    var objType: any = null;
    var varName: any = null;
    var varType: any = null;
    var varVal: any = null;
    var nodes: lib.__internal.avm2.XMLList = x.children();
    for (node of nodes) {
      nodeName = node.name().toString();
      if (nodeName == "obj") {
        objName = node.o;
        objType = node.t;
        if (objType == "a") {
          o[objName] = [];
        } else if (objType == "o") {
          o[objName] = {};
        }
        this.xml2obj(node, o[objName]);
      } else if (nodeName == "var") {
        varName = node.n;
        varType = node.t;
        varVal = node.toString();
        if (varType == "b") {
          o[varName] = varVal == "0" ? false : true;
        } else if (varType == "n") {
          o[varName] = Number(varVal);
        } else if (varType == "s") {
          o[varName] = varVal;
        } else if (varType == "x") {
          o[varName] = null;
        }
      }
    }
  }
}
