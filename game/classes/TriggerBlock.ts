import lib from "swf-lib";
import { Tile } from "./Tile";

export class TriggerBlock extends Tile /*lib.flash.display.MovieClip*/ {

  public declare typeTrigger: string;

  public declare triggered: boolean;

  public declare isLock: boolean;

  public declare dst : TriggerBlock;

  public declare letter : string;

  public declare color : number;

  public declare counter : number;

  public declare popCycle : number;

  public declare popStart : number;

  public declare frameCount : number;

  public declare activatedSHW :boolean;

  
  public constructor() {
    super();
    this.triggered = false;
    this.activatedSHW = false;
    this.counter = 0;
    this.parent["createTrigger"](this);
    this.typeTrigger = this.name;
    if ((this.typeTrigger.includes("LCK") && this.typeTrigger.includes("2")) || this.typeTrigger.includes("POP")|| this.typeTrigger.includes("SHW")){
      super.init();
      if (this.typeTrigger.includes("SHW")) {
        this.name += "SHW";
      }
    }
    if (this.typeTrigger.includes("POP")) {
      var values = this.typeTrigger.slice(3).split(',');
      this.popStart = +values[0];
      this.popCycle = +values[1];
      this.frameCount = -1;
      console.log(this.popStart+" "+this.popCycle);
    }
    this.letter = this.typeTrigger.substr(3, 1);
  }

  public init() :any {
    if (this.typeTrigger.includes("LCK")){
        this.isLock = true;
        if(this.typeTrigger.includes("1")) {
            /*this.dst = this.parent.getChildByName(
                `LCK${this.letter}2`
            ) as TriggerBlock;*/

            var tmp = this.parent.__children.find((c) => (c as TriggerBlock).typeTrigger == `LCK${this.letter}2`) ?? null;
            if (tmp != null) {
              this.dst = tmp as TriggerBlock;
              this.dst.counter++;
            }
            console.log(this.dst);
        } else {
            this.dst = null;
        }
    }
    else if (this.typeTrigger.includes("SHW")){
      this.isLock = true;
      if(this.typeTrigger.includes("1")) {
          /*this.dst = this.parent.getChildByName(
              `LCK${this.letter}2`
          ) as TriggerBlock;*/

          var tmp = this.parent.__children.find((c) => (c as TriggerBlock).typeTrigger == `SHW${this.letter}2`) ?? null;
          if (tmp != null) {
            this.dst = tmp as TriggerBlock;
            this.dst.counter++;
          }
          console.log(this.dst);
      } else {
          this.dst = null;
      }
  }
  }

  public triggerLCK(level) {
    console.log(this.counter);
    this.color =  4294953984;
    if(this.typeTrigger.includes("LCK")) {
      for (var i: any = 0; i < level.triggers.length; i++) {
        var triggerSrc = level.triggers[i];
        if (triggerSrc.dst == this && triggerSrc.triggered == false) {
          return;
        }
      }
      console.log("change name, unlock "+this.name)
      level.applyObstacleColour(this, 0x00000000);
      this.name="zizi";
    } else if (this.typeTrigger.includes("SHW")) {
      console.log("coucou");
      for (var i: any = 0; i < level.triggers.length; i++) {
        var triggerSrc = level.triggers[i];
        if (triggerSrc.dst == this && triggerSrc.triggered == false) {
          return;
        }
      }
      console.log("ACTIVATE");
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
    this.frameCount = (this.frameCount+1)%(this.popCycle*2);
    //console.log(this.frameCount);
    if(this.frameCount==this.popCycle) {
      this.name = this.name.slice(0,-5);
      //console.log(this.name);
      level.applyObstacleColour(this, 0xFFFFFFFF);
    } if(this.frameCount==0) {
      this.name+="DEPOP"
      level.applyObstacleColour(this, 0x00000000);
    }
  }
}
