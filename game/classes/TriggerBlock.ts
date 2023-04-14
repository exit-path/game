import lib from "swf-lib";
import { Tile } from "./Tile";

export class TriggerBlock extends Tile /*lib.flash.display.MovieClip*/ {

  public declare typeTrigger: string;

  public declare triggered: boolean;

  public declare isLock: boolean;

  public declare dst : TriggerBlock[];

  public declare letter : string;

  public declare color : number;

  public declare popCycleOff : number;
  public declare popCycleOn : number;
  public declare popStart : number;
  public declare firstPop : boolean;

  public declare frameCount : number;

  public declare activatedSHW :boolean;

  public declare effectOn : boolean;

  public txt = new lib.flash.text.TextField();
  
  public constructor() {
    super();
    this.effectOn = true;
    this.dst=[];
    this.firstPop = true;
    this.triggered = false;
    this.activatedSHW = false;
    this.parent["createTrigger"](this);
    this.typeTrigger = this.name;
    if ((this.typeTrigger.includes("DEL") && this.typeTrigger.includes("2")) || this.typeTrigger.includes("POP")|| this.typeTrigger.includes("SHW") || this.typeTrigger.includes("JMP")){
      super.init();
      if (this.typeTrigger.includes("SHW")) {
        this.name += "SHW";
      }
    }
    if (this.typeTrigger.includes("POP")) {
      var values = this.typeTrigger.slice(3).split(',');
      this.popStart = +values[0];
      this.popCycleOn = +values[1];
      this.popCycleOff = +values[2];
      this.frameCount = -1;
      this.name += "DEPOP";
    }
    this.letter = this.typeTrigger.substr(3, 1);
  }

  public init() :any {
    if (this.typeTrigger.includes("DEL")){
        this.isLock = true;
        if(this.typeTrigger.includes("1")) {
            for (var i of this.parent.__children) {
              if((i as TriggerBlock).typeTrigger == `DEL${this.letter}2`) {
                this.dst.push(i as TriggerBlock);
              }
            }
        }
    }
    else if (this.typeTrigger.includes("SHW")){
      this.isLock = true;
      if(this.typeTrigger.includes("1")) {
          for (var i of this.parent.__children) {
            if((i as TriggerBlock).typeTrigger == `SHW${this.letter}2`) {
              this.dst.push(i as TriggerBlock);
            }
          }
      }
    }
  }

  public addText() {
    this.txt.__container.layoutBounds[2] = 1000;
    this.txt.__container.layoutBounds[3] = 1000;
    this.txt.__container.defaultTextFormat.color = 0xffffffff;
    this.txt.__container.defaultTextFormat.font = "Bitstream Vera Sans";
    this.txt.__container.defaultTextFormat.size = 22;
    this.txt.__container.layout();
    if(this.name.includes("SHW"))
      this.txt.text = "S"+this.name[4];
    else if (this.name.includes("DEL"))
      this.txt.text = "D"+this.name[4];
    else if (this.name.includes("SKN"))
      this.txt.text = " ? ";
    this.txt.x +=3;
    this.txt.y += 5;
    this.txt.width = this.width;
    this.txt.height = this.height;
    this.addChild(this.txt);
  }

  public triggerDEL(level) {
    this.color =  4294953984;
    if(this.typeTrigger.includes("DEL") ) {
      for (var i: any = 0; i < level.triggers.length; i++) {
        var triggerSrc = level.triggers[i];
        if (triggerSrc.dst.includes(this) && triggerSrc.triggered == false) {
          return;
        }
      }
      level.applyObstacleColour(this, 0x00000000);
      this.name="zzzz";
    } else if (this.typeTrigger.includes("SHW") ) {
      for (var i: any = 0; i < level.triggers.length; i++) {
        var triggerSrc = level.triggers[i];
        if (triggerSrc.dst.includes(this) && triggerSrc.triggered == false) {
          return;
        }
      }
      level.applyObstacleColour(this, 0xFFFFFF00);
      if (this.activatedSHW == false) {
        this.name = this.name.slice(0,-3);
        this.activatedSHW = true;
      }
    }
  }

  public popCheck(level) {
    this.frameCount = (this.frameCount+1)
    if(this.firstPop && this.frameCount == this.popStart) {
      this.firstPop = false;
      this.frameCount = this.popCycleOff-1;
    } 
    else if (!this.firstPop) {
      this.frameCount %= (this.popCycleOn + this.popCycleOff);
      if(this.frameCount==this.popCycleOff) {
        this.name = this.name.slice(0,-5);
        level.applyObstacleColour(this, 0xFFFFFFFF);
      } if(this.frameCount==0) {
        this.name+="DEPOP"
        level.applyObstacleColour(this, 0x00000000);
      }
    }
  }
}
