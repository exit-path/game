import { makeAutoObservable } from "mobx";
import { Level } from "../../../shared/level";
import type { RootStore } from "./root";

export type ModalInstance = { id: number } & ModalInstanceProps;

type ModalInstanceProps =
  | ModalEnterUserLevelProps
  | ModalConnectMultiplayerProps
  | ModalRoomSelectionProps;

type ModalEnterUserLevelProps = {
  type: "enter-user-level";
  onEnterLevel: (level: number | Level) => void;
};

type ModalConnectMultiplayerProps = {
  type: "connect-multiplayer";
  onEnterAddress: (address: string) => void;
};

type ModalRoomSelectionProps = {
  type: "room-selection";
};

export class ModalStore {
  nextInstanceId = 1;
  instances: ModalInstance[] = [];

  get shouldSuspendGame() {
    for (const { type } of this.instances) {
      switch (type) {
        case "room-selection":
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
