import { autorun, makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export const defaultKeybindings = {
  kill: "KeyK",
  pause: "KeyP",
  resume: "Escape",
  focus: "KeyF",
  beam: "KeyB",
  restart: "KeyJ",

  left1: "ArrowLeft",
  left2: "KeyA",
  right1: "ArrowRight",
  right2: "KeyD",
  up1: "ArrowUp",
  up2: "KeyW",
  down1: "ArrowDown",
  down2: "KeyS",
  flow1: "Space",
  flow2: "ShiftLeft",
  flow3: "ShiftRight",
};

export class Keybindings {
  kill = defaultKeybindings.kill;
  pause = defaultKeybindings.pause;
  resume = defaultKeybindings.resume;
  focus = defaultKeybindings.focus;
  beam = defaultKeybindings.beam;
  restart = defaultKeybindings.restart;

  left1 = defaultKeybindings.left1;
  left2 = defaultKeybindings.left2;
  right1 = defaultKeybindings.right1;
  right2 = defaultKeybindings.right2;
  up1 = defaultKeybindings.up1;
  up2 = defaultKeybindings.up2;
  down1 = defaultKeybindings.down1;
  down2 = defaultKeybindings.down2;
  flow1 = defaultKeybindings.flow1;
  flow2 = defaultKeybindings.flow2;
  flow3 = defaultKeybindings.flow3;

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
    this.resume = String(keybindings?.resume ?? defaultKeybindings.resume);
    this.focus = String(keybindings?.focus ?? defaultKeybindings.focus);
    this.beam = String(keybindings?.beam ?? defaultKeybindings.beam);
    this.restart = String(keybindings?.restart ?? defaultKeybindings.restart);

    this.left1 = String(keybindings?.left1 ?? defaultKeybindings.left1);
    this.left2 = String(keybindings?.left2 ?? defaultKeybindings.left2);
    this.right1 = String(keybindings?.right1 ?? defaultKeybindings.right1);
    this.right2 = String(keybindings?.right2 ?? defaultKeybindings.right2);
    this.up1 = String(keybindings?.up1 ?? defaultKeybindings.up1);
    this.up2 = String(keybindings?.up2 ?? defaultKeybindings.up2);
    this.down1 = String(keybindings?.down1 ?? defaultKeybindings.down1);
    this.down2 = String(keybindings?.down2 ?? defaultKeybindings.down2);
    this.flow1 = String(keybindings?.flow1 ?? defaultKeybindings.flow1);
    this.flow2 = String(keybindings?.flow2 ?? defaultKeybindings.flow2);
    this.flow3 = String(keybindings?.flow3 ?? defaultKeybindings.flow3);
  }

  private save() {
    const keybindings = {
      kill: this.kill,
      pause: this.pause,
      resume: this.resume,
      focus: this.focus,
      beam: this.beam,
      restart: this.restart,
      left1: this.left1,
      left2: this.left2,
      right1: this.right1,
      right2: this.right2,
      up1: this.up1,
      up2: this.up2,
      down1: this.down1,
      down2: this.down2,
      flow1: this.flow1,
      flow2: this.flow2,
      flow3: this.flow3,
    };
    localStorage.setItem("KeyBindings", JSON.stringify(keybindings));
  }

  reset() {
    this.kill = defaultKeybindings.kill;
    this.pause = defaultKeybindings.pause;
    this.resume = defaultKeybindings.resume;
    this.focus = defaultKeybindings.focus;
    this.beam = defaultKeybindings.beam;
    this.restart = defaultKeybindings.restart;
    this.left1 = defaultKeybindings.left1;
    this.left2 = defaultKeybindings.left2;
    this.right1 = defaultKeybindings.right1;
    this.right2 = defaultKeybindings.right2;
    this.up1 = defaultKeybindings.up1;
    this.up2 = defaultKeybindings.up2;
    this.down1 = defaultKeybindings.down1;
    this.down2 = defaultKeybindings.down2;
    this.flow1 = defaultKeybindings.flow1;
    this.flow2 = defaultKeybindings.flow2;
    this.flow3 = defaultKeybindings.flow3;
  }
}
