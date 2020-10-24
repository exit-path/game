import lib from "swf-lib";
import { manifest as _manifest } from "../data";
import * as classes from "./classes";

const manifest = _manifest as lib.__internal.Manifest;
export { manifest };

lib.__internal.ClassRegistry.instance.addClassRoot(classes);
