import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import styles from "./WhatsNew.module.scss";

interface Props {
  className?: string;
  modalId: number;
  newVersions: Record<string, string[]>;
}

export const WhatsNew = observer<Props>(function WhatsNew(props) {
  const { modalId, newVersions } = props;
  const { modal } = useStore();

  const onClose = useCallback(() => {
    modal.dismiss(modalId);
  }, [modal, modalId]);

  return (
    <Modal.Dialog className={props.className}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>What's New</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.body}>
        {Object.entries(newVersions).map(([version, changes]) => (
          <React.Fragment key={version}>
            <h5>{version}</h5>
            <ul className={styles.changes}>
              {changes.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </Modal.Body>
    </Modal.Dialog>
  );
});
