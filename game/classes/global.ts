import lib from "swf-lib";
import { MainTimeline } from "./Exit_fla/MainTimeline";

export function main(): MainTimeline {
  return lib.flash.display.Stage.__current
    .__children[0] as unknown as MainTimeline;
}

export interface Keybindings {
  kill: string;
  pause: string;
}
