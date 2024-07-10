import lib from "swf-lib";
import { MainTimeline } from "./Exit_fla/MainTimeline";

export function main(): MainTimeline {
  return lib.flash.display.Stage.__current
    .__children[0] as unknown as MainTimeline;
}

export interface Keybindings {
  kill: string;
  pause: string;
  resume: string;

  left1: string;
  left2: string;
  right1: string;
  right2: string;
  up1: string;
  up2: string;
  down1: string;
  down2: string;
  flow1: string;
  flow2: string;
  flow3: string;
}
