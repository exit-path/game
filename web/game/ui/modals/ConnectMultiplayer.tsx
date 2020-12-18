import React, { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import styles from "./EnterUserLevel.module.scss";

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

  const onFormSubmit = useCallback(
    (data: FormData) => {
      modal.dismiss(modalId);
      onEnterAddress(data.address);
    },
    [modal, modalId, onEnterAddress]
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
