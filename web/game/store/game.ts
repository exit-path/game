import { autorun, makeAutoObservable } from "mobx";
import lib from "swf-lib";
import { MainTimeline } from "../../../game/classes/Exit_fla/MainTimeline";
import {
  ExternalEvent,
  ExternalEventProps,
} from "../../../game/classes/ExternalEvent";
import { Relay } from "../../../game/classes/john/Relay";
import { versions } from "../../config";
import { MultiplayerStore } from "./multiplayer";
import type { RootStore } from "./root";

export class GameStore {
  container: HTMLElement | null = null;
  stage: lib.flash.display.Stage | null = null;
  main: MainTimeline | null = null;

  multiplayer: MultiplayerStore | null = null;

  isInSPMenu = false;
  isInModify = false;
  numCheckpoints: number | null = null;

  constructor(readonly root: RootStore) {
    makeAutoObservable(this);

    autorun(
      () => {
        if (this.stage) {
          this.stage.__isActive = this.isActive;
        }
      },
      { name: "bindGameActive" }
    );
  }

  get isActive(): boolean {
    return !this.root.modal.shouldSuspendGame;
  }

  get instance(): MainTimeline {
    if (!this.main) {
      throw new Error("Game is not started yet");
    }
    return this.main;
  }

  start() {
    if (!this.root.library.value) {
      throw new Error("library is not loaded yet");
    } else if (this.stage) {
      return;
    }

    const library = this.root.library.value;
    const stage = new lib.flash.display.Stage(library.properties);
    this.stage = stage;

    stage.__withContext(() => {
      const main: MainTimeline = library.instantiateCharacter(0);
      main.addEventListener(ExternalEvent.TYPE, (e: ExternalEvent) =>
        this.handleExternalEvent(e.props)
      );
      this.main = main;
      stage.addChild(main);
    })();

    this.stage.__canvas.container.remove();
    this.container?.appendChild(this.stage.__canvas.container);

    this.stage.__canvas.container.style.width = "100%";
    this.stage.__canvas.container.style.height = "100%";
    this.stage.__canvas.element.style.width = "100%";
    this.stage.__canvas.element.style.height = "100%";

    this.root.controller?.onGameStarted();
    this.checkVersion();
  }

  dispose() {
    if (!this.stage) {
      return;
    }
    this.stage.__canvas.container.remove();
    this.stage.__dispose();
    this.main = null;
    this.stage = null;
  }

  setContainer = (container: HTMLDivElement) => {
    this.container = container;

    if (this.stage) {
      this.stage.__canvas.container.remove();
      this.container?.appendChild(this.stage.__canvas.container);
    }
  };

  focus() {
    this.stage?.__canvas.element.focus();
  }

  dispatchMainEvent(e: lib.flash.events.Event) {
    this.stage?.__withContext(() => {
      this.main?.dispatchEvent(e);
    })();
  }

  private handleExternalEvent(event: ExternalEventProps) {
    switch (event.type) {
      case "connect-multiplayer":
        this.root.modal.present({
          type: "connect-multiplayer",
          onEnterAddress: (address) => {
            this.focus();
            const main = this.main;
            if (!main) {
              return;
            }

            this.dispatchMainEvent(
              new Relay(Relay.GOTO, "MultiplayerMenu", "QuickPlay")
            );

            const mp = new MultiplayerStore(this.root, address);
            this.multiplayer = mp;
            main.multiplayer.quickPlayLobby.step = 1;
            mp.connect()
              .then(() => {
                main.multiplayer.quickPlayLobby.step = 2;
              })
              .catch((e) => {
                if (this.multiplayer) {
                  this.multiplayer.logMessage(
                    `Cannot connect to server: ${e}`,
                    0xff0000
                  );
                }
              });
          },
        });
        break;

      case "disconnect-multiplayer":
        this.multiplayer?.disconnect();
        this.multiplayer = null;
        break;

      case "report-position": {
        const [, v, x, y, fr, sx, time] = event.position;
        this.multiplayer
          ?.reportPosition(v, x, y, fr, sx, time)
          .catch((e) => console.log(e));
        break;
      }

      case "report-checkpoint":
        this.multiplayer
          ?.reportCheckpoint(event.id)
          .catch((e) => console.log(e));
        break;

      case "give-kudo":
        this.multiplayer?.giveKudo(event.targetId).catch((e) => console.log(e));
        break;

      case "sp-menu-start":
        this.isInSPMenu = true;
        break;

      case "sp-menu-end":
        this.isInSPMenu = false;
        break;

      case "modify-start":
        this.isInModify = true;
        break;

      case "modify-end":
        this.isInModify = false;
        break;

      case "mp-game-init":
        this.numCheckpoints =
          this.main?.multiplayer?.game?.level?.checkPoints?.length ?? 0;
        break;

      case "mp-game-end":
        this.numCheckpoints = null;
        break;
    }
  }

  private checkVersion() {
    const newVersions: Record<string, string[]> = {};
    const lastVersion = localStorage.getItem("LastGameClientVersion");
    const gameVersions = versions.map((v) => v[0]);
    let seenLastVersion = !gameVersions.includes(lastVersion ?? "");
    for (const [version, ...changes] of versions) {
      if (seenLastVersion) {
        newVersions[version] = changes;
      } else if (version === lastVersion) {
        seenLastVersion = true;
      }
    }

    if (Object.keys(newVersions).length > 0) {
      this.root.modal.present({ type: "whats-new", newVersions });
    }
    localStorage.setItem(
      "LastGameClientVersion",
      gameVersions[gameVersions.length - 1]
    );
  }
}
