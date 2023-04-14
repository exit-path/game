import lib from "swf-lib";
import { Level } from "../Level";
import { Tile } from "../Tile";
import { Math2 } from "./Math2";

export class TileObject extends lib.flash.display.MovieClip {
  public declare bl: Tile;

  public declare bm: Tile;

  public declare bounce: number;

  public declare bounceTolerance: number;

  public declare br: Tile;

  public declare cblx: number;

  public declare cbly: number;

  public declare cbmx: number;

  public declare cbmy: number;

  public declare cbrx: number;

  public declare cbry: number;

  public declare clmx: number;

  public declare clmy: number;

  public declare cmx: number;

  public declare cmy: number;

  public declare crmx: number;

  public declare crmy: number;

  public declare ctlx: number;

  public declare ctly: number;

  public declare ctmx: number;

  public declare ctmy: number;

  public declare ctrx: number;

  public declare ctry: number;

  public declare curLevel: Level;

  public declare dXVel: number;

  public declare dYVel: number;

  public declare guyBL: boolean;

  public declare guyBM: boolean;

  public declare guyBR: boolean;

  public declare guyLM: boolean;

  public declare guyRM: boolean;

  public declare guyTL: boolean;

  public declare guyTM: boolean;

  public declare guyTR: boolean;

  public declare holdCounter: number;

  public declare holdDown: boolean;

  public declare holdUp: boolean;

  public declare hops: number;

  public declare jumpCounter: number;

  public declare jumping: boolean;

  public declare jumpLevel: boolean;

  public declare lastX: number;

  public declare lastY: number;

  public declare lm: Tile;

  public declare mb: Tile;

  public declare modX: number;

  public declare playerJump: boolean;

  public declare playerSize: number;

  public declare rm: Tile;

  public declare rotSpeed: number;

  public declare targetObject: lib.flash.display.MovieClip;

  public declare thudTresh: number;

  public declare tileSize: number;

  public declare tl: Tile;

  public declare tm: Tile;

  public declare tr: Tile;

  public declare typeOf: string;

  public declare xAcc: number;

  public declare xF: number;

  public declare xGrav: number;

  public declare xLove: number;

  public declare xMax: number;

  public declare xVel: number;

  public declare yAcc: number;

  public declare yF: number;

  public declare yGrav: number;

  public declare yLove: number;

  public declare yMax: number;

  public declare yVel: number;

  public constructor() {
    super();
    this.thudTresh = 2;
    this.holdDown = false;
    this.guyTL = false;
    this.guyTM = false;
    this.xVel = 0;
    this.guyTR = false;
    this.xLove = 0;
    this.guyLM = false;
    this.yMax = 20;
    this.cblx = 0;
    this.cbly = 0;
    this.holdCounter = 0;
    this.yAcc = 1;
    this.hops = -8;
    this.cbmy = 0;
    this.cmx = 0;
    this.cbmx = 0;
    this.crmx = 0;
    this.crmy = 0;
    this.yVel = 0;
    this.bounceTolerance = 0;
    this.cmy = 0;
    this.ctrx = 0;
    this.ctry = 0;
    this.yGrav = 0.6;
    this.playerSize = 0;
    this.lastY = 0;
    this.bounce = -0.3;
    this.dXVel = 8;
    this.yLove = 3;
    this.lastX = 0;
    this.modX = 0;
    this.playerJump = false;
    this.rotSpeed = 1;
    this.typeOf = "none";
    this.holdUp = false;
    this.ctlx = 0;
    this.ctly = 0;
    this.guyRM = false;
    this.xMax = 30;
    this.xF = 0;
    this.tileSize = 25;
    this.clmx = 0;
    this.clmy = 0;
    this.guyBM = false;
    this.guyBR = false;
    this.guyBL = false;
    this.ctmy = 0;
    this.cbrx = 0;
    this.cbry = 0;
    this.dYVel = 0;
    this.xAcc = 1;
    this.ctmx = 0;
    this.yF = 1;
    this.jumpCounter = 0;
    this.jumping = false;
    this.jumpLevel = false;
    this.xGrav = 0;
    this.curLevel = new Level();
    this.targetObject = this as lib.flash.display.MovieClip;
  }

  public bounding(): any {
    if (this.yVel < 0) {
      if (this.checkTile(this.x, this.y + this.yVel, 0, this.curLevel)) {
        this.y = this.y + this.yVel;
        if (this.yGrav < 0) {
          this.y = Math.ceil(this.y);
        }
      } else {
        this.xVel = this.xVel * this.xF;
        this.yVel = this.yVel * this.bounce;
        this.rotSpeed = this.rotSpeed * -1;
        if (this.tr) {
          this.y = this.tr.y + this.tileSize + this.targetObject.height;
          this.hitBlock(this.tr);
          this.touchBlock(this.tr);
        } else if (this.tl) {
          this.y = this.tl.y + this.tileSize + this.targetObject.height;
          this.hitBlock(this.tl);
          this.touchBlock(this.tl);
        }
        if (this.yVel < this.thudTresh && this.yVel > 0 - this.thudTresh) {
          this.yVel = 0;
        }
        if (this.yGrav < 0) {
          this.jumping = false;
        }
      }
    } else if (this.yVel > 0) {
      if (this.checkTile(this.x, this.y + this.yVel, 1, this.curLevel)) {
        this.y = this.y + this.yVel;
      } else {
        if (this.yVel <= this.bounceTolerance) {
          if (this.yVel > this.bounceTolerance) {
          }
        }
        this.xVel = this.xVel * this.xF;
        this.yVel = this.yVel * this.bounce;
        if (this.yGrav > 0) {
          this.jumping = false;
        }
        if (this.bl) {
          this.y = this.bl.y;
          this.touchBlock(this.bl);
        } else if (this.br) {
          this.y = this.br.y;
          this.touchBlock(this.br);
        } else if (this.bm) {
          this.y = this.bm.y;
          this.touchBlock(this.bm);
        }
        if (this.yVel < this.thudTresh && this.yVel > 0 - this.thudTresh) {
          this.yVel = 0;
        }
        if (Math.abs(this.yVel) > 6) {
          this.rotSpeed = this.rotSpeed * (Math2.random(8) - 4);
        } else {
          this.rotSpeed = this.rotSpeed * 0.5;
        }
      }
    }
    if (this.xVel < 0) {
      if (
        this.checkTile(this.x + this.xVel + this.modX, this.y, 3, this.curLevel)
      ) {
        this.x = this.x + (this.xVel + this.modX);
      } else {
        this.yVel = this.yVel * this.yF;
        this.xVel = this.xVel * this.bounce;
        if (this.xVel < this.bounceTolerance) {
        }
        if (this.bl) {
          this.x = this.bl.x + this.targetObject.width / 2 + this.tileSize;
          this.touchBlock(this.bl);
        } else if (this.br) {
          this.x = this.br.x - this.targetObject.width / 2 + this.tileSize;
          this.touchBlock(this.br);
        }
        if (this.xVel < this.thudTresh && this.xVel > 0 - this.thudTresh) {
          this.xVel = 0;
        }
      }
    } else if (this.xVel > 0) {
      if (
        this.checkTile(this.x + this.xVel + this.modX, this.y, 2, this.curLevel)
      ) {
        this.x = this.x + (this.xVel + this.modX);
      } else {
        this.yVel = this.yVel * this.yF;
        this.xVel = this.xVel * this.bounce;
        if (this.xVel > this.bounceTolerance) {
        }
        if (this.br) {
          this.x = this.br.x - this.targetObject.width / 2;
          this.touchBlock(this.br);
        } else if (this.bl) {
          this.x = this.bl.x + this.targetObject.width / 2;
          this.touchBlock(this.bl);
        }
        if (this.xVel < this.thudTresh && this.xVel > 0 - this.thudTresh) {
          this.xVel = 0;
        }
      }
    }
    if (this.xVel > this.xMax) {
      this.xVel = this.xMax;
    }
    if (this.xVel < 0 - this.xMax) {
      this.xVel = 0 - this.xMax;
    }
    if (this.yVel > this.yMax) {
      this.yVel = this.yMax;
    }
    if (this.yVel < 0 - this.yMax) {
      this.yVel = 0 - this.yMax;
    }
  }

  public bounding2(): any {
    if (this.yVel < 0) {
      if (this.checkArray(this.x, this.y + this.yVel, 0, this.curLevel)) {
        this.y = this.y + this.yVel;
        if (this.yGrav < 0) {
          this.y = Math.ceil(this.y);
        }
      } else {
        this.xVel = this.xVel * this.xF;
        this.yVel = this.yVel * this.bounce;
        this.rotSpeed = this.rotSpeed * -1;
        if (this.tr) {
          this.y = this.tr.y + this.tileSize + this.targetObject.height;
          this.hitBlock(this.tr);
          this.touchBlock(this.tr);
        } else if (this.tl) {
          this.y = this.tl.y + this.tileSize + this.targetObject.height;
          this.hitBlock(this.tl);
          this.touchBlock(this.tl);
        }
        if (this.yVel < this.thudTresh && this.yVel > 0 - this.thudTresh) {
          this.yVel = 0;
        }
        if (this.yGrav < 0) {
          this.jumping = false;
        }
      }
    } else if (this.yVel > 0) {
      if (this.checkArray(this.x, this.y + this.yVel, 1, this.curLevel)) {
        this.y = this.y + this.yVel;
      } else {
        if (this.yVel <= this.bounceTolerance) {
          if (this.yVel > this.bounceTolerance) {
          }
        }
        this.xVel = this.xVel * this.xF;
        this.yVel = this.yVel * this.bounce;
        if (this.yGrav > 0) {
          this.jumping = false;
        }
        if (this.bl) {
          this.y = this.bl.y;
          this.touchBlock(this.bl);
        } else if (this.br) {
          this.y = this.br.y;
          this.touchBlock(this.br);
        } else if (this.bm) {
          this.y = this.bm.y;
          this.touchBlock(this.bm);
        }
        if (this.yVel < this.thudTresh && this.yVel > 0 - this.thudTresh) {
          this.yVel = 0;
        }
        if (Math.abs(this.yVel) > 6) {
          this.rotSpeed = this.rotSpeed * (Math2.random(8) - 4);
        } else {
          this.rotSpeed = this.rotSpeed * 0.5;
        }
      }
    }
    if (this.xVel < 0) {
      if (this.checkArray(this.x + this.xVel, this.y, 3, this.curLevel)) {
        this.x = this.x + this.xVel;
      } else {
        this.yVel = this.yVel * this.yF;
        this.xVel = this.xVel * this.bounce;
        if (this.xVel < this.bounceTolerance) {
        }
        if (this.bl) {
          this.x = this.bl.x + this.targetObject.width / 2 + this.tileSize;
          this.touchBlock(this.bl);
        } else if (this.br) {
          this.x = this.br.x - this.targetObject.width / 2 + this.tileSize;
          this.touchBlock(this.br);
        }
        if (this.xVel < this.thudTresh && this.xVel > 0 - this.thudTresh) {
          this.xVel = 0;
        }
      }
    } else if (this.xVel > 0) {
      if (this.checkArray(this.x + this.xVel, this.y, 2, this.curLevel)) {
        this.x = this.x + this.xVel;
      } else {
        this.yVel = this.yVel * this.yF;
        this.xVel = this.xVel * this.bounce;
        if (this.xVel > this.bounceTolerance) {
        }
        if (this.br) {
          this.x = this.br.x - this.targetObject.width / 2;
          this.touchBlock(this.br);
        }
        if (this.bl) {
          this.x = this.bl.x + this.targetObject.width / 2;
          this.touchBlock(this.bl);
        }
        if (this.xVel < this.thudTresh && this.xVel > 0 - this.thudTresh) {
          this.xVel = 0;
        }
      }
    }
    if (this.xVel > this.xMax) {
      this.xVel = this.xMax;
    }
    if (this.xVel < 0 - this.xMax) {
      this.xVel = 0 - this.xMax;
    }
    if (this.yVel > this.yMax) {
      this.yVel = this.yMax;
    }
    if (this.yVel < 0 - this.yMax) {
      this.yVel = 0 - this.yMax;
    }
  }

  private checkArray(xPos: any, yPos: any, dir: any, holder: any): any {
    this.guyTL = false;
    this.guyTR = false;
    this.guyBL = false;
    this.guyBR = false;
    this.guyBM = false;
    this.guyTM = false;
    this.guyLM = false;
    this.guyRM = false;
    var toW: number = this.targetObject.width;
    var toH: number = this.targetObject.height;
    this.ctlx = xPos - toW / 2 + 1;
    this.ctly = yPos - toH + 1;
    this.ctrx = xPos + toW / 2 - 1;
    this.ctry = yPos - toH + 1;
    this.cbrx = xPos + toW / 2 - 1;
    this.cbry = yPos - 1;
    this.cblx = xPos - toW / 2 + 1;
    this.cbly = yPos - 1;
    this.clmx = xPos - toW / 2 + 1;
    this.clmy = yPos - toH / 2 + 1;
    this.ctmx = xPos + 1;
    this.ctmy = yPos - toH + 1;
    this.crmx = xPos + toW / 2 - 1;
    this.crmy = yPos - toH / 2 + 1;
    this.cbmx = xPos + 1;
    this.cbmy = yPos - 1;
    this.cmx = this.ctmx;
    this.cmy = this.clmy;
    var pTL: number =
      this.curLevel.tArr[Math.floor(this.ctly / this.tileSize)][
        Math.floor(this.ctlx / this.tileSize)
      ];
    var pTR: number =
      this.curLevel.tArr[Math.floor(this.ctry / this.tileSize)][
        Math.floor(this.ctrx / this.tileSize)
      ];
    var pBR: number =
      this.curLevel.tArr[Math.floor(this.cbry / this.tileSize)][
        Math.floor(this.cbrx / this.tileSize)
      ];
    var pBL: number =
      this.curLevel.tArr[Math.floor(this.cbly / this.tileSize)][
        Math.floor(this.cblx / this.tileSize)
      ];
    var pTM: number =
      this.curLevel.tArr[Math.floor(this.ctmy / this.tileSize)][
        Math.floor(this.ctmx / this.tileSize)
      ];
    var pLM: number =
      this.curLevel.tArr[Math.floor(this.clmy / this.tileSize)][
        Math.floor(this.clmx / this.tileSize)
      ];
    var pBM: number =
      this.curLevel.tArr[Math.floor(this.cbmy / this.tileSize)][
        Math.floor(this.cbmx / this.tileSize)
      ];
    var pRM: number =
      this.curLevel.tArr[Math.floor(this.crmy / this.tileSize)][
        Math.floor(this.crmx / this.tileSize)
      ];
    if (pTL > 0) {
      if (pTL == 1) {
        this.guyTL = true;
      } else {
        this.guyTL = false;
      }
    }
    if (pTR > 0) {
      if (pTR == 1) {
        this.guyTR = true;
      } else {
        this.guyTR = false;
      }
    }
    if (pBR > 0) {
      if (pBR == 1) {
        this.guyBR = true;
      } else if (pBR == 2 && this.yVel > 0) {
        this.guyBR = true;
      } else {
        this.guyBR = false;
      }
    }
    if (pBL > 0) {
      if (pBL == 1) {
        this.guyBL = true;
      } else if (pBL == 2 && this.yVel > 0) {
        this.guyBL = true;
      } else {
        this.guyBL = false;
      }
    }
    if (pTM > 0) {
      if (pTM == 1) {
        this.guyTM = true;
      } else {
        this.guyTM = false;
      }
    }
    if (pBM > 0) {
      if (pBM == 1) {
        this.guyBM = true;
      } else {
        this.guyBM = false;
      }
    }
    if (pLM > 0) {
      if (pLM == 1) {
        this.guyLM = true;
      } else {
        this.guyLM = false;
      }
    }
    if (pRM > 0) {
      if (pRM == 1) {
        this.guyRM = true;
      } else {
        this.guyRM = false;
      }
    }
    if (this.yGrav > 0) {
      if (this.guyBM || this.guyBL || this.guyBR) {
        this.yLove = 0;
        this.holdCounter = 0;
      }
      if (this.playerSize == 0) {
        if ((this.guyBM && this.guyBL) || (this.guyBM && this.guyBR)) {
          this.jumpLevel = true;
        }
      }
      if (this.playerSize == 1) {
        if (this.guyBR && this.guyBL) {
          this.jumpLevel = true;
        }
      }
    } else {
      if (this.guyTM || this.guyTL || this.guyTR) {
        this.yLove = 0;
        this.holdCounter = 0;
      }
      if ((this.guyTM && this.guyTL) || (this.guyTM && this.guyTR)) {
        this.jumpLevel = true;
      }
    }
    switch (dir) {
      case 0:
        if (this.guyTL || this.guyTR) {
          return false;
        }
      case 1:
        if (this.guyBR || this.guyBL) {
          return false;
        }
      case 2:
        if (this.guyTR || this.guyBR) {
          return false;
        }
      case 3:
        if (this.guyTL || this.guyBL) {
          return false;
        }
        break;
      default:
        if (this.guyTL || this.guyBL) {
          return false;
        }
        break;
    }
    return true;
  }

  private checkTile(xPos: any, yPos: any, dir: any, holder: any): any {
    this.guyTL = false;
    this.guyTR = false;
    this.guyBL = false;
    this.guyBR = false;
    this.guyBM = false;
    this.guyTM = false;
    this.guyLM = false;
    this.guyRM = false;
    var toW: number = this.targetObject.width;
    var toH: number = this.targetObject.height;
    this.ctlx = xPos - toW / 2 + 1;
    this.ctly = yPos - toH + 1;
    this.ctrx = xPos + toW / 2 - 1;
    this.ctry = yPos - toH + 1;
    this.cbrx = xPos + toW / 2 - 1;
    this.cbry = yPos - 1;
    this.cblx = xPos - toW / 2 + 1;
    this.cbly = yPos - 1;
    this.clmx = xPos - toW / 2 + 1;
    this.clmy = yPos - toH / 2 + 1;
    this.ctmx = xPos + 1;
    this.ctmy = yPos - toH + 1;
    this.crmx = xPos + toW / 2 - 1;
    this.crmy = yPos - toH / 2 + 1;
    this.cbmx = xPos + 1;
    this.cbmy = yPos - 1;
    this.cmx = this.ctmx;
    this.cmy = this.clmy;
    this.tl = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.ctlx / this.tileSize) +
        "x" +
        Math.floor(this.ctly / this.tileSize)
    ) as Tile;
    this.tr = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.ctrx / this.tileSize) +
        "x" +
        Math.floor(this.ctry / this.tileSize)
    ) as Tile;
    this.br = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.cbrx / this.tileSize) +
        "x" +
        Math.floor(this.cbry / this.tileSize)
    ) as Tile;
    this.bl = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.cblx / this.tileSize) +
        "x" +
        Math.floor(this.cbly / this.tileSize)
    ) as Tile;
    this.tm = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.ctmx / this.tileSize) +
        "x" +
        Math.floor(this.ctmy / this.tileSize)
    ) as Tile;
    this.lm = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.clmx / this.tileSize) +
        "x" +
        Math.floor(this.clmy / this.tileSize)
    ) as Tile;
    this.bm = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.cbmx / this.tileSize) +
        "x" +
        Math.floor(this.cbmy / this.tileSize)
    ) as Tile;
    this.rm = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.crmx / this.tileSize) +
        "x" +
        Math.floor(this.crmy / this.tileSize)
    ) as Tile;
    this.mb = this.curLevel.getChildByName(
      "tile" +
        Math.floor(this.cbmx / this.tileSize) +
        "x" +
        Math.floor(this.cbly / this.tileSize)
    ) as Tile;
    if (this.tl) {
      if (this.tl.type == 1) {
        this.guyTL = true;
        this.pass(this.tl);
      } else {
        this.guyTL = false;
      }
    }
    if (this.tr) {
      if (this.tr.type == 1) {
        this.guyTR = true;
        this.pass(this.tr);
      } else {
        this.guyTR = false;
      }
    }
    if (this.br) {
      if (this.br.type == 1) {
        this.guyBR = true;
        this.pass(this.br);
      } else if (this.br.type == 2 && this.yVel > 0) {
        this.guyBR = true;
      } else {
        this.guyBR = false;
      }
    }
    if (this.bl) {
      if (this.bl.type == 1) {
        this.guyBL = true;
        this.pass(this.bl);
      } else if (this.bl.type == 2 && this.yVel > 0) {
        this.guyBL = true;
      } else {
        this.guyBL = false;
      }
    }
    if (this.tm) {
      if (this.tm.type == 1) {
        this.guyTM = true;
        this.pass(this.tm);
      } else {
        this.guyTM = false;
      }
    }
    if (this.bm) {
      if (this.bm.type == 1) {
        this.guyBM = true;
        this.pass(this.bm);
      } else {
        this.guyBM = false;
      }
    }
    if (this.lm) {
      if (this.lm.type == 1) {
        this.guyLM = true;
        this.pass(this.lm);
      } else {
        this.guyLM = false;
      }
    }
    if (this.rm) {
      if (this.rm.type == 1) {
        this.guyRM = true;
        this.pass(this.rm);
      } else {
        this.guyRM = false;
      }
    }
    if (this.yGrav > 0) {
      if (this.guyBM || this.guyBL || this.guyBR) {
        this.yLove = 0;
        this.holdCounter = 0;
      }
      if (this.playerSize == 0) {
        if ((this.guyBM && this.guyBL) || (this.guyBM && this.guyBR)) {
          this.jumpLevel = true;
        }
        if (this.guyBL && !this.guyTL) {
          this.jumpLevel = true;
        }
        if (this.guyBR && !this.guyTR) {
          this.jumpLevel = true;
        }
      }
      if (this.playerSize == 1) {
        if (this.guyBR && this.guyBL) {
          this.jumpLevel = true;
        }
        if (this.guyBL && !this.guyTL) {
          this.jumpLevel = true;
        }
        if (this.guyBR && !this.guyTR) {
          this.jumpLevel = true;
        }
      }
    } else {
      if (this.guyTM || this.guyTL || this.guyTR) {
        this.yLove = 0;
        this.holdCounter = 0;
      }
      if ((this.guyTM && this.guyTL) || (this.guyTM && this.guyTR)) {
        this.jumpLevel = true;
      }
    }
    switch (dir) {
      case 0:
        if (this.guyTL || this.guyTR) {
          return false;
        }
      case 1:
        if (this.guyBR || this.guyBL) {
          return false;
        }
      case 2:
        if (this.guyTR || this.guyBR) {
          return false;
        }
      case 3:
        if (this.guyTL || this.guyBL) {
          return false;
        }
        break;
      default:
        if (this.guyTL || this.guyBL) {
          return false;
        }
        break;
    }
    return true;
  }

  public hitBlock(mov: lib.flash.display.MovieClip): any {}

  public init(lev: Level): any {
    this.curLevel = lev;
    this.lastX = this.x;
    this.lastX = this.y;
  }

  public normalHorizontal(): any {
    this.xVel = this.xVel + this.xGrav;
    if (this.xGrav > 0) {
      if (this.xLove == 1) {
        if (!this.holdUp) {
          this.xVel++;
        }
        if (this.xVel >= 0) {
          this.xLove = 2;
          this.xVel = 0;
        }
      }
      if (this.xLove == 2 || this.xLove == 3) {
        if (this.xVel > 0) {
          this.xLove = 3;
        }
      }
      if (this.xLove == 3 && !this.holdUp) {
        this.xLove = 0;
        this.holdCounter = 0;
      }
      if (this.xLove == 0 && this.xVel > 1.5) {
        this.xVel = 3;
      }
      if (this.xLove == 0) {
        this.playerJump = false;
      }
    } else {
      if (this.xLove == 1) {
        if (!this.holdUp) {
          this.xVel--;
        }
        if (this.yVel <= 0) {
          this.xLove = 2;
          this.xVel = 0;
        }
      }
      if (this.xLove == 2 || this.xLove == 3) {
        if (this.xVel < 0) {
          this.xLove = 3;
        }
      }
      if (this.xLove == 3 && this.xVel == 0 && !this.holdUp) {
        this.xLove = 0;
        this.holdCounter = 0;
      }
      if (this.xLove == 0 && this.yVel < 1.5) {
        this.xLove = 3;
      }
      if (this.xLove == 0) {
        this.playerJump = false;
      }
    }
  }

  public normalVertical(): any {
    this.yVel = this.yVel + this.yGrav;
    if (this.yGrav > 0) {
      if (this.yLove == 1) {
        if (!this.holdUp) {
          this.yVel++;
        }
        if (this.yVel >= 0) {
          this.yLove = 2;
          this.yVel = 0;
        }
      }
      if (this.yLove == 2 || this.yLove == 3) {
        if (this.yVel > 0) {
          this.yLove = 3;
        }
      }
      if (this.yLove == 3 && this.yVel == 0 && !this.holdUp) {
        this.yLove = 0;
        this.holdCounter = 0;
      }
      if (this.yLove == 0 && this.yVel > 1.5) {
        this.yLove = 3;
      }
      if (this.yLove == 0) {
        this.playerJump = false;
      }
    } else {
      if (this.yLove == 1) {
        if (!this.holdUp) {
          this.yVel--;
        }
        if (this.yVel <= 0) {
          this.yLove = 2;
          this.yVel = 0;
        }
      }
      if (this.yLove == 2 || this.yLove == 3) {
        if (this.yVel < 0) {
          this.yLove = 3;
        }
      }
      if (this.yLove == 3 && this.yVel == 0 && !this.holdUp) {
        this.yLove = 0;
        this.holdCounter = 0;
      }
      if (this.yLove == 0 && this.yVel < 1.5) {
        //this.yLove = 3;
      }
      if (this.yLove == 0) {
        this.playerJump = false;
      }
    }
    if (this.yLove != 0) {
      this.jumpLevel = false;
    }
  }

  public pass(mov: lib.flash.display.MovieClip): any {}

  public touchBlock(mov: lib.flash.display.MovieClip): any {}

  public updateTileInteraction(): any {
    this.lastX = this.x;
    this.lastY = this.y;
    this.normalVertical();
    this.bounding();
    if (this.typeOf == "egg") {
      this.y = Math.floor(this.y);
    }
    if (this.typeOf == "deadaphant") {
      this.y = Math.floor(this.y);
    }
  }
}
