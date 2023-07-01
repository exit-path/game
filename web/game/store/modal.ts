import { makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export type ModalInstance = { id: number } & ModalInstanceProps;

type ModalInstanceProps =
  | ModalSelectLevelProps
  | ModalConnectMultiplayerProps
  | ModalRoomSelectionProps
  | ModalWhatsNewProps
  | ModalKeybindingsProps;

type ModalSelectLevelProps = {
  type: "select-level";
  onEnterLevel: (level: number | string) => void;
};

type ModalConnectMultiplayerProps = {
  type: "connect-multiplayer";
  onEnterAddress: (address: string) => void;
};

type ModalRoomSelectionProps = {
  type: "room-selection";
};

type ModalWhatsNewProps = {
  type: "whats-new";
  newVersions: Record<string, string[]>;
};

type ModalKeybindingsProps = {
  type: "keybindings";
};

export class ModalStore {
  nextInstanceId = 1;
  instances: ModalInstance[] = [];

  get shouldSuspendGame() {
    for (const { type } of this.instances) {
      switch (type) {
        case "room-selection":
        case "select-level":
          continue;
        default:
          return true;
      }
    }
    return false;
  }

  constructor(readonly root: RootStore) {
    makeAutoObservable(this);
  }

  present(props: ModalInstanceProps) {
    const id = this.nextInstanceId++;
    this.instances.push({ id, ...props });
    return id;
  }

  dismiss(id: number) {
    const index = this.instances.findIndex((inst) => inst.id === id);
    if (index < 0) {
      return;
    }
    this.instances.splice(index, 1);
  }
}
