import { autorun, makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export class Preferences {
  clearChatOnGameStart: boolean = true;

  constructor(readonly root: RootStore) {
    makeAutoObservable(this);

    this.reset();
    this.load();
    autorun(() => {
      this.save();
    });
  }

  private load() {
    let preferences: any = undefined;
    try {
      preferences = JSON.parse(localStorage.getItem("Preferences") ?? "{}");
    } catch {}

    this.clearChatOnGameStart = Boolean(
      preferences?.clearChatOnGameStart ?? true
    );
  }

  private save() {
    const preferences = {
      clearChatOnGameStart: this.clearChatOnGameStart,
    };
    localStorage.setItem("Preferences", JSON.stringify(preferences));
  }

  reset() {
    this.clearChatOnGameStart = true;
  }
}
