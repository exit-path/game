import React, { useCallback, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import { Relay } from "../../../../game/classes/john/Relay";
import { useStore } from "../../store";
import styles from "./RoomSelection.module.scss";

interface Props {
  className?: string;
  modalId: number;
}

interface FormData {
  roomName: string;
}

export const RoomSelection = observer<Props>(function RoomSelection(props) {
  const { modalId } = props;
  const { game, modal } = useStore();

  const { register, handleSubmit, errors } = useForm<FormData>();

  useEffect(
    () =>
      autorun(() => {
        if (!game.multiplayer || game.multiplayer.roomId !== "lobby") {
          modal.dismiss(modalId);
        }
      }),
    [game.multiplayer, modal, modalId]
  );

  const onFormSubmit = useCallback(
    (data: FormData) => {
      modal.dismiss(modalId);
    },
    [modal, modalId]
  );

  const onClose = useCallback(() => {
    modal.dismiss(modalId);
    game.dispatchMainEvent(new Relay(Relay.GOTO, "QuickPlayLobby", "Back"));
  }, [modal, modalId, game]);

  return (
    <Modal.Dialog className={props.className}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Rooms</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.content}>
        <ul className={styles.roomList}></ul>
        <Form
          className={styles.createRoom}
          inline
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Form.Label>Room name:</Form.Label>
          <Form.Control
            name="roomName"
            className={styles.roomName}
            placeholder="Room name"
            spellCheck={false}
            ref={register}
          />
          <Form.Control.Feedback type="invalid" className={styles.feedback}>
            {errors.roomName?.message}
          </Form.Control.Feedback>
          <Button variant="secondary" type="submit">
            Create
          </Button>
        </Form>
        <div className={styles.sep} />
      </Modal.Body>
    </Modal.Dialog>
  );
});
