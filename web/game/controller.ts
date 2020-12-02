import { RootStore } from "./store/root";

export interface Controller {
  setRoot(root: RootStore | null): void;

  onGameStarted(): void;
}
