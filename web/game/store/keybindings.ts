import { autorun, makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export const defaultKeybindings = {
  kill: "KeyK",
  pause: "KeyP",
  focus: "KeyF",
  beam: "KeyB",
  restart: "KeyJ",
};

export class Keybindings {
  kill = defaultKeybindings.kill;
  pause = defaultKeybindings.pause;
  focus = defaultKeybindings.focus;
  beam = defaultKeybindings.beam;
  restart = defaultKeybindings.restart;

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
    this.restart = String(keybindings?.restart ?? defaultKeybindings.restart);
  }

  private save() {
    const keybindings = {
      kill: this.kill,
      pause: this.pause,
      focus: this.focus,
      beam: this.beam,
      restart: this.restart,
    };
    localStorage.setItem("KeyBindings", JSON.stringify(keybindings));
  }

  reset() {
    this.kill = defaultKeybindings.kill;
    this.pause = defaultKeybindings.pause;
    this.focus = defaultKeybindings.focus;
    this.beam = defaultKeybindings.beam;
    this.restart = defaultKeybindings.restart;
  }
}
