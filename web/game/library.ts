import lib from "swf-lib";
import { manifest } from "../../game";

type ProgressReporter = (value: number) => void;

let libraryProgress: ProgressReporter[] = [];
let libraryPromise: Promise<lib.__internal.AssetLibrary>;

function reportProgress(value: number) {
  for (const p of libraryProgress) {
    p(value);
  }
}

export function loadLibrary(progress?: (value: number) => void) {
  const promise =
    libraryPromise ??
    (libraryPromise = lib.__internal.loadManifest(manifest, reportProgress));
  if (progress) {
    libraryProgress.push(progress);
    promise.then(
      () => (libraryProgress = libraryProgress.filter((p) => p !== progress))
    );
  }
  return promise;
}
