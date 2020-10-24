import lib from "swf-lib";
import { manifest } from "../../game";

let libraryPromise: Promise<lib.__internal.AssetLibrary>;

export function loadLibrary(progress?: (value: number) => void) {
  return (
    libraryPromise ?? (libraryPromise = lib.__internal.loadManifest(manifest))
  );
}
