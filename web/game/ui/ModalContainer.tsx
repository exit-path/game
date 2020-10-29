import React from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useStore } from "../../game/store";
import { ModalInstance } from "../../game/store/modal";
import { EnterUserLevel } from "./modals/EnterUserLevel";
import styles from "./ModalContainer.module.scss";

interface Props {
  className?: string;
}

export const ModalContainer = observer<Props>(function ModalContainer(props) {
  const { modal } = useStore();
  return (
    <div className={cn(props.className, styles.container)}>
      {props.children}
      {modal.instances.map((instance) => (
        <Instance key={instance.id} modal={instance} />
      ))}
    </div>
  );
});

interface InstanceProps {
  modal: ModalInstance;
}

const Instance = observer<InstanceProps>(function Instance(props) {
  let children: JSX.Element;
  switch (props.modal.type) {
    case "enter-user-level":
      children = (
        <EnterUserLevel
          className={styles.dialog}
          modalId={props.modal.id}
          onEnterLevel={props.modal.onEnterLevel}
        />
      );
  }
  return <div className={styles.overlay}>{children}</div>;
});
