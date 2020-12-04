import { makeAutoObservable, observable } from "mobx";
import type { Controller } from "../game";
import type { RootStore } from "../game/store/root";

export class GameController implements Controller {
  root: RootStore | null = null;

  constructor(readonly isRecorderMode: boolean) {
    makeAutoObservable(this, { root: observable.ref });
  }

  setRoot(root: RootStore | null): void {
    this.root = root;
  }

  onGameStarted() {
    if (this.isRecorderMode) {
      this.root?.recorder.skipToSPMenu();
    }
  }
}
