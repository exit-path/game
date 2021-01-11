import React, { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { MPServer, mpServers } from "../../../config";
import { useStore } from "../../store";
import styles from "./ConnectMultiplayer.module.scss";

interface ServerItemProps {
  server: MPServer;
  onConnect: (address: string) => void;
}
const ServerItem = observer<ServerItemProps>(function ServerItem(props) {
  const {
    server: { name, address },
    onConnect,
  } = props;

  const onClick = useCallback(() => {
    onConnect(address);
  }, [address, onConnect]);

  return (
    <li className={styles.serverItem}>
      <button className={styles.connect} type="button" onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enable-background="new 0 0 24 24"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <g>
            <rect fill="none" height="24" width="24" />
          </g>
          <g>
            <path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" />
          </g>
        </svg>
      </button>
      <span className={styles.name}>{name}</span>
    </li>
  );
});

interface Props {
  className?: string;
  modalId: number;
  onEnterAddress: (address: string) => void;
}

interface FormData {
  address: string;
}

export const ConnectMultiplayer = observer<Props>(function ConnectMultiplayer(
  props
) {
  const { modalId, onEnterAddress } = props;
  const { modal } = useStore();

  const { register, handleSubmit, errors, formState } = useForm<FormData>();

  const connectServer = useCallback(
    (address: string) => {
      modal.dismiss(modalId);
      onEnterAddress(address);
    },
    [modal, modalId, onEnterAddress]
  );

  const onFormSubmit = useCallback(
    (data: FormData) => {
      connectServer(data.address);
    },
    [connectServer]
  );

  const onClose = useCallback(() => {
    modal.dismiss(modalId);
  }, [modal, modalId]);

  const validateAddress = useCallback((address: string): string | boolean => {
    try {
      new URL(address);
      return true;
    } catch (e) {
      return String(e);
    }
  }, []);

  return (
    <Modal.Dialog className={cn(styles.dialog, props.className)}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Connect Multiplayer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="connectMultiplayer"
          className={styles.form}
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Form.Label>Server address:</Form.Label>
          <Form.Control
            name="address"
            className={styles.address}
            placeholder="Server address"
            spellCheck={false}
            isValid={formState.isSubmitted && !errors.address}
            isInvalid={formState.isSubmitted && !!errors.address}
            ref={register({ required: true, validate: validateAddress })}
          />
          <ul className={styles.serverList}>
            {mpServers.map((server, i) => (
              <ServerItem key={i} server={server} onConnect={connectServer} />
            ))}
          </ul>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Form.Control.Feedback
          type="invalid"
          className={errors.address && styles.feedback}
        >
          {errors.address?.message}
        </Form.Control.Feedback>
        <Button variant="primary" type="submit" form="connectMultiplayer">
          Connect
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
});
