import { GameStore } from "./game";

export class RootStore {
  readonly game = new GameStore(this);
}
