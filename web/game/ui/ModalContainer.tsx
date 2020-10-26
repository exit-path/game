import React, { useCallback } from "react";
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
  const { modal } = useStore();

  const onClose = useCallback(() => {
    modal.dismiss(props.modal.id);
  }, [modal, props.modal.id]);

  let children: JSX.Element;
  switch (props.modal.type) {
    case "sp-user-level":
      children = <EnterUserLevel className={styles.dialog} onClose={onClose} />;
  }
  return <div className={styles.overlay}>{children}</div>;
});
