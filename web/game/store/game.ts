import { createRef } from "react";
import { makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export class GameStore {
  readonly containerRef = createRef<HTMLDivElement>();

  constructor(readonly root: RootStore) {
    makeAutoObservable(this, {
      containerRef: false,
    });
  }
}
