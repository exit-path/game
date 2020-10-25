import { GameStore } from "./game";
import { LibraryStore } from "./library";
import { ModalStore } from "./modal";

const library = new LibraryStore();

export class RootStore {
  readonly library = library;
  readonly game = new GameStore(this);
  readonly modal = new ModalStore(this);

  dispose() {
    this.game.dispose();
  }
}
