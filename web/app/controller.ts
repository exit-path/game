import { makeAutoObservable, observable } from "mobx";
import type { Controller } from "../game";
import type { RootStore } from "../game/store/root";

export class GameController implements Controller {
  root: RootStore | null = null;

  constructor(readonly isRecorderMode: boolean) {
    makeAutoObservable(this, { root: observable.ref });
  }

  setRoot(root: RootStore | null): void {
    console.log(root);
    this.root = root;
  }

  async onGameStarted() {
    if (this.isRecorderMode) {
      this.root?.recorder.skipToSPMenu();
      this.root?.recorder.startSPGame(0);
    }
  }
}
