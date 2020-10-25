import { makeAutoObservable, autorun } from "mobx";
import lib from "swf-lib";
import type { RootStore } from "./root";
import { MainTimeline } from "../../../game/classes/Exit_fla/MainTimeline";

export class GameStore {
  container: HTMLElement | null = null;
  stage: lib.flash.display.Stage | null = null;
  main: MainTimeline | null = null;

  constructor(readonly root: RootStore) {
    makeAutoObservable(this);
  }

  start() {
    if (!this.root.library.value) {
      throw new Error("library is not loaded yet");
    }

    const library = this.root.library.value;
    const stage = new lib.flash.display.Stage(library.properties);
    this.stage = stage;

    stage.__withContext(() => {
      const main: MainTimeline = library.instantiateCharacter(0);
      this.main = main;
      stage.addChild(main);
    })();

    this.container?.appendChild(stage.__canvas.container);
  }

  dispose() {
    if (!this.stage) {
      return;
    }
    this.stage.__canvas.container.remove();
    this.stage.__dispose();
    this.main = null;
    this.stage = null;
  }

  setContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  private setupStageContainer = autorun(() => {
    if (!this.container || !this.stage) {
      return;
    }

    this.stage.__canvas.container.remove();
    this.container.appendChild(this.stage.__canvas.container);
  });
}
