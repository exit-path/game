import lib from "swf-lib";

export class Emit extends lib.flash.display.MovieClip {
  public declare objects: any[];

  public constructor() {
    super();
    this.objects = new Array<any>();
  }

  public killObject(curObjNum: number): any {
    this.objects[curObjNum].parent.removeChild(this.objects[curObjNum]);
    this.objects[curObjNum] = null;
    this.objects.splice(curObjNum, 1);
  }

  public manage(mov: lib.flash.display.MovieClip): any {
    this.objects.push(mov);
  }

  public ping(): any {
    var curObj: any = null;
    for (var i: number = 0; i < this.objects.length; i++) {
      curObj = this.objects[i];
      if (curObj.timerKill) {
        curObj.ping();
        curObj.killCounter--;
        if (curObj.killCounter <= 0) {
          this.killObject(i);
          i--;
        }
      } else if (curObj.currentFrame == curObj.totalFrames) {
        this.killObject(i);
        i--;
      }
    }
  }
}
