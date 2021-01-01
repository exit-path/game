import React, { useCallback, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { Relay } from "../../../../game/classes/john/Relay";
import { RemoteRoom, RoomLobbyState } from "../../models/multiplayer";
import { useStore } from "../../store";
import styles from "./RoomSelection.module.scss";

interface RoomItemProps {
  room: RemoteRoom;
}

const RoomItem = observer<RoomItemProps>(function RoomItem(props) {
  const { id, name, numPlayers } = props.room;
  const { game } = useStore();

  const onJoin = useCallback(() => {
    game.multiplayer
      ?.joinRoom(id)
      .catch((e) => ({ error: String(e) }))
      .then(({ error }) => {
        if (error) {
          game.multiplayer?.logMessage(`Cannot join room: ${error}`, 0xff0000);
        }
      });
  }, [id, game]);

  return (
    <li className={styles.item}>
      <span>{name}</span>
      <span>{numPlayers}</span>
      <div className={styles.actions}>
        <button className={styles.action} onClick={onJoin}>
          Join
        </button>
      </div>
    </li>
  );
});

interface RoomListProps {
  rooms: RemoteRoom[];
}

const RoomList = observer<RoomListProps>(function RoomList(props) {
  return (
    <div className={styles.roomList}>
      <div className={styles.headerWrapper}>
        <div className={styles.header}>
          <span>Name</span>
          <span>Players</span>
        </div>
        <div className={styles.spacer} />
      </div>
      <ul className={styles.list}>
        {props.rooms.map((r) => (
          <RoomItem key={r.id} room={r} />
        ))}
      </ul>
    </div>
  );
});

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

  const { register, handleSubmit, errors, setError } = useForm<FormData>();

  const room = game.multiplayer?.room;

  useEffect(
    () =>
      reaction(
        () => room?.id === "lobby",
        (isInLobby) => {
          if (!isInLobby) {
            modal.dismiss(modalId);
          }
        },
        { fireImmediately: true }
      ),
    [room, modal, modalId]
  );

  const onFormSubmit = useCallback(
    (data: FormData) => {
      game.multiplayer
        ?.createRoom(data.roomName)
        .catch((e) => ({ error: String(e) }))
        .then(({ error }) => {
          if (error) {
            setError("roomName", { message: error });
          }
        });
    },
    [game.multiplayer, setError]
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
        {room?.id === "lobby" && (
          <RoomList rooms={(room.state as RoomLobbyState).rooms} />
        )}
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
