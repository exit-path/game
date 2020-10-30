import React, { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { Level, parse } from "../../../../shared/level";
import { useStore } from "../../store";
import styles from "./EnterUserLevel.module.scss";

interface Props {
  className?: string;
  modalId: number;
  onEnterLevel: (level: Level) => void;
}

interface FormData {
  levelCode: string;
}

export const EnterUserLevel = observer<Props>(function EnterUserLevel(props) {
  const { modalId, onEnterLevel } = props;
  const { modal } = useStore();

  const { register, handleSubmit, errors, formState } = useForm<FormData>();

  const onFormSubmit = useCallback(
    (data: FormData) => {
      modal.dismiss(modalId);
      onEnterLevel(parse(data.levelCode.replace(/^\s*(!custom)?|\s*$/g, "")));
    },
    [modal, modalId, onEnterLevel]
  );

  const onClose = useCallback(() => {
    modal.dismiss(modalId);
  }, [modal, modalId]);

  const validateLevelCode = useCallback((levelCode: string):
    | string
    | boolean => {
    try {
      parse(levelCode.replace(/^\s*(!custom\s*)?|\s*$/g, ""));
      return true;
    } catch (e) {
      return String(e);
    }
  }, []);

  return (
    <Modal.Dialog className={cn(styles.dialog, props.className)}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>User Level</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="levelCode"
          className={styles.codeForm}
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Form.Control
            name="levelCode"
            className={styles.codeArea}
            size="sm"
            as="textarea"
            placeholder="Level Code"
            spellCheck={false}
            isValid={formState.isSubmitted && !errors.levelCode}
            isInvalid={formState.isSubmitted && !!errors.levelCode}
            ref={register({ required: true, validate: validateLevelCode })}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Form.Control.Feedback
          type="invalid"
          className={errors.levelCode && styles.feedback}
        >
          {errors.levelCode?.message}
        </Form.Control.Feedback>
        <Button variant="primary" type="submit" form="levelCode">
          Enter
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
});
