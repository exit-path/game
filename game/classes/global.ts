import lib from "swf-lib";
import { MainTimeline } from "./Exit_fla/MainTimeline";

export function main(o: lib.flash.display.DisplayObject): MainTimeline {
  return (o.stage.__children[0] as unknown) as MainTimeline;
}
