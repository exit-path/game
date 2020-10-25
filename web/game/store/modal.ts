import { makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export type ModalInstance = { id: number } & ModalInstanceProps;

type ModalInstanceProps = { type: "sp-user-level" };

export class ModalStore {
  nextInstanceId = 1;
  instances: ModalInstance[] = [];

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
