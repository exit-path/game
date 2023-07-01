import { autorun, makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export const defaultKeybindings = {
  kill: "KeyK",
  pause: "KeyP",
  focus: "KeyF",
  beam: "KeyB",
};

export class Keybindings {
  kill = defaultKeybindings.kill;
  pause = defaultKeybindings.pause;
  focus = defaultKeybindings.focus;
  beam = defaultKeybindings.beam;

  constructor(readonly root: RootStore) {
    makeAutoObservable(this);
    this.load();
    autorun(() => {
      this.save();
    });
  }

  private load() {
    let keybindings: any = undefined;
    try {
      keybindings = JSON.parse(localStorage.getItem("KeyBindings") ?? "{}");
    } catch {}

    this.kill = String(keybindings?.kill ?? defaultKeybindings.kill);
    this.pause = String(keybindings?.pause ?? defaultKeybindings.pause);
    this.focus = String(keybindings?.focus ?? defaultKeybindings.focus);
    this.beam = String(keybindings?.beam ?? defaultKeybindings.beam);
  }

  private save() {
    const keybindings = {
      kill: this.kill,
      pause: this.pause,
      focus: this.focus,
      beam: this.beam,
    };
    localStorage.setItem("KeyBindings", JSON.stringify(keybindings));
  }

  reset() {
    this.kill = defaultKeybindings.kill;
    this.pause = defaultKeybindings.pause;
    this.focus = defaultKeybindings.focus;
    this.beam = defaultKeybindings.beam;
  }
}
