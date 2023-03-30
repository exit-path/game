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

  
  public constructor() {
    super();
    this.dst=[];
    this.firstPop = true;
    this.triggered = false;
    this.activatedSHW = false;
    this.parent["createTrigger"](this);
    this.typeTrigger = this.name;
    if ((this.typeTrigger.includes("DEL") && this.typeTrigger.includes("2")) || this.typeTrigger.includes("POP")|| this.typeTrigger.includes("SHW")){
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
      this.frameCount = 0;
      this.name += "DEPOP";
      console.log(this.popStart+" "+this.popCycleOn+" "+this.popCycleOff);
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
            console.log(this.dst);
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
          console.log(this.dst);
         
      }
    }
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
      this.name="zizi";
    } else if (this.typeTrigger.includes("SHW") ) {
      for (var i: any = 0; i < level.triggers.length; i++) {
        var triggerSrc = level.triggers[i];
        if (triggerSrc.dst.includes(this) && triggerSrc.triggered == false) {
          return;
        }
      }
      console.log(this.name);
      level.applyObstacleColour(this, 0xFFFFFF00);
      if (this.activatedSHW == false) {
        this.name = this.name.slice(0,-3);
        this.activatedSHW = true;
      }
      console.log(this.name);
    }
  }

  public popCheck(level) {
    this.frameCount = (this.frameCount+1)
    //console.log(this.frameCount);
    if(this.firstPop && this.frameCount == this.popStart) {
      console.log("START"+this.frameCount);
      this.firstPop = false;
      this.frameCount = this.popCycleOff-1;
    } 
    if (!this.firstPop) {
      this.frameCount %= (this.popCycleOn + this.popCycleOff);
      if(this.frameCount==this.popCycleOff) {
        this.name = this.name.slice(0,-5);
        //console.log(this.name);
        level.applyObstacleColour(this, 0xFFFFFFFF);
      } if(this.frameCount==0) {
        this.name+="DEPOP"
        level.applyObstacleColour(this, 0x00000000);
      }
    }
  }
}
