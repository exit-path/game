import { autorun, makeAutoObservable } from "mobx";
import lib from "swf-lib";
import { MainTimeline } from "../../../game/classes/Exit_fla/MainTimeline";
import {
  ExternalEvent,
  ExternalEventProps,
} from "../../../game/classes/ExternalEvent";
import { Relay } from "../../../game/classes/john/Relay";
import { MultiplayerStore } from "./multiplayer";
import type { RootStore } from "./root";

export class GameStore {
  container: HTMLElement | null = null;
  stage: lib.flash.display.Stage | null = null;
  private main: MainTimeline | null = null;

  multiplayer: MultiplayerStore | null = null;

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

    autorun(
      () => {
        if (!this.stage || !this.multiplayer) {
          return;
        }
        const handler = this.stage.__withContext((err: unknown) => {
          if (err) {
            this.main?.multiplayer?.tubes.onConnectionLost();
          }
        });
        const mp = this.multiplayer;
        mp.conn.onclose(handler);
      },
      { name: "connectionLost" }
    );
  }

  get isActive(): boolean {
    return this.root.modal.instances.length === 0;
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

    this.root.controller?.onGameStarted();
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

  private dispatchMainEvent(e: lib.flash.events.Event) {
    this.stage?.__withContext(() => {
      this.main?.dispatchEvent(e);
    })();
  }

  private handleExternalEvent(event: ExternalEventProps) {
    switch (event.type) {
      case "sp-user-level":
        this.root.modal.present({
          type: "enter-user-level",
          onEnterLevel: (level) => {
            this.focus();
            this.stage?.__withContext(() => {
              this.main?.setUserLevel(level);
              this.main?.startPracticeLevel(999);
            })();
          },
        });
        break;

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
                  alert(`Cannot connect to server: ${e}`);
                  this.stage?.__withContext(() => {
                    this.main?.multiplayer.tubes.onConnectionLost();
                  })();
                }
              });
          },
        });
        break;

      case "disconnect-multiplayer":
        this.multiplayer?.disconnect();
        this.multiplayer = null;
    }
  }
}
