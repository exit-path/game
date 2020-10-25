import { GameStore } from "./game";
import { LibraryStore } from "./library";

const library = new LibraryStore();

export class RootStore {
  readonly library = library;
  readonly game = new GameStore(this);

  dispose() {
    this.game.dispose();
  }
}
