import { autorun, makeAutoObservable } from "mobx";
import lib from "swf-lib";
import { MainTimeline } from "../../../game/classes/Exit_fla/MainTimeline";
import {
  ExternalEvent,
  ExternalEventProps,
} from "../../../game/classes/ExternalEvent";
import type { RootStore } from "./root";

export class GameStore {
  container: HTMLElement | null = null;
  stage: lib.flash.display.Stage | null = null;
  private main: MainTimeline | null = null;

  constructor(readonly root: RootStore) {
    makeAutoObservable(this);

    autorun(
      () => {
        if (this.stage) {
          this.stage.__isActive = this.isActive;
        }
      },
      { name: "bindGameActive" }
    );
  }

  get isActive(): boolean {
    return this.root.modal.instances.length === 0;
  }

  get instance(): MainTimeline {
    if (!this.main) {
      throw new Error("Game is not started yet");
    }
    return this.main;
  }

  start() {
    if (!this.root.library.value) {
      throw new Error("library is not loaded yet");
    } else if (this.stage) {
      return;
    }

    const library = this.root.library.value;
    const stage = new lib.flash.display.Stage(library.properties);
    this.stage = stage;

    stage.__withContext(() => {
      const main: MainTimeline = library.instantiateCharacter(0);
      main.addEventListener(ExternalEvent.TYPE, (e: ExternalEvent) =>
        this.handleExternalEvent(e.props)
      );
      this.main = main;
      stage.addChild(main);
    })();

    this.stage.__canvas.container.remove();
    this.container?.appendChild(this.stage.__canvas.container);
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

    if (this.stage) {
      this.stage.__canvas.container.remove();
      this.container?.appendChild(this.stage.__canvas.container);
    }
  };

  private handleExternalEvent(event: ExternalEventProps) {
    switch (event.type) {
      case "sp-user-level":
        this.root.modal.present({
          type: "enter-user-level",
          onEnterLevel: (level) => {
            this.stage?.__withContext(() => {
              this.main?.setUserLevel(level);
              this.main?.startPracticeLevel(999);
            })();
          },
        });
        break;
    }
  }
}
