import { action, makeAutoObservable } from "mobx";
import { Controller } from "../controller";
import { GameStore } from "./game";
import { Keybindings } from "./keybindings";
import { LibraryStore } from "./library";
import { ModalStore } from "./modal";
import { RecorderStore } from "./recorder";

const library = new LibraryStore();

export class RootStore {
  readonly library = library;
  readonly game = new GameStore(this);
  readonly modal = new ModalStore(this);
  readonly recorder = new RecorderStore(this);
  readonly keybindings = new Keybindings(this);
  controller: Controller | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  dispose() {
    this.game.dispose();
  }
}

if (module.hot) {
  module.hot.dispose(
    action(() => {
      library.value = null;
    })
  );
}
