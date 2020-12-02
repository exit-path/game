import { makeAutoObservable } from "mobx";
import { Relay } from "../../../game/classes/john";
import type { RootStore } from "./root";

export class RecorderStore {
  constructor(readonly root: RootStore) {
    makeAutoObservable(this);
  }

  skipToSPMenu() {
    const mt = this.root.game.instance;
    const stage = this.root.game.stage;
    if (!mt || !stage) {
      return;
    }

    stage.__withContext(() => {
      mt.gotoAndStop(3);
      mt.removeChild(mt.agIntro);
      mt.dispatchEvent(new Relay(Relay.GOTO, "endIntro", " "));
      mt.dispatchEvent(new Relay(Relay.GOTO, "MainMenu", "SinglePlayer"));
    })();
  }

  startSPGame(level: number) {
    const mt = this.root.game.instance;
    const stage = this.root.game.stage;
    if (!mt || !stage) {
      return;
    }

    stage.__withContext(() => {
      if (mt.multiplayer?.game?.mode === "SP") {
        mt.dispatchEvent(new Relay(Relay.GOTO, "Game", "SinglePlayerMenu"));
      }

      mt.playerObj.gameLevel = level;
      mt.playerObj.gameTime = 0;
      mt.dispatchEvent(new Relay(Relay.GOTO, "SinglePlayerMenu", "StartGame"));
    })();
  }
}
