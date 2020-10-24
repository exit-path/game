import lib from "swf-lib";
import { manifest } from "../game";

export async function start() {
  const loadIndicator = document.getElementById("loading")!;
  const library = await lib.__internal.loadManifest(manifest, (progress) => {
    loadIndicator.textContent = `Loading... ${(progress * 100).toFixed(0)}%`;
  });
  loadIndicator.remove();

  const stage = new lib.flash.display.Stage(library.properties);
  document.getElementById("root")!.appendChild(stage.__canvas.container);

  stage.addChild(library.instantiateCharacter(0));
}
