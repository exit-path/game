import { makeAutoObservable, observable } from "mobx";
import type { Controller } from "../game";
import type { RootStore } from "../game/store/root";

const alphabetBase32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export class GameController implements Controller {
  root: RootStore | null = null;

  get recording(): string {
    return (
      this.root?.recorder.recording
        .map((keys) => alphabetBase32.charAt(keys))
        .join("") ?? ""
    );
  }

  set recording(value: string) {
    if (!this.root) {
      return;
    }
    this.root.recorder.recording = Array.from(value).map((keys) =>
      alphabetBase32.indexOf(keys)
    );
  }

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
