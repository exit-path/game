import React, { ChangeEvent, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import styles from "./Preferences.module.scss";

interface Props {
  className?: string;
  modalId: number;
}

export const Preferences = observer<Props>(function WhatsNew(props) {
  const { modalId } = props;
  const { modal, preferences } = useStore();

  const onClose = useCallback(() => {
    modal.dismiss(modalId);
  }, [modal, modalId]);

  const onReset = useCallback(() => {
    preferences.reset();
  }, [preferences]);

  const onClearChatOnGameStartChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      runInAction(() => {
        preferences.clearChatOnGameStart = e.currentTarget.checked;
      });
    },
    [preferences]
  );

  return (
    <Modal.Dialog className={props.className}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.body}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th className={styles.cell}>
                <label className={styles.entryLabel}>
                  Clear Chat on Game Start
                </label>
              </th>
              <td className={styles.cell}>
                <input
                  type="checkbox"
                  checked={preferences.clearChatOnGameStart}
                  onChange={onClearChatOnGameStartChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button variant="secondary" type="button" onClick={onReset}>
          Reset
        </Button>
      </Modal.Body>
    </Modal.Dialog>
  );
});
