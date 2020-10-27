import React, { useCallback, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import styles from "./EnterUserLevel.module.scss";

interface Props {
  className?: string;
  onClose: () => void;
}

export const EnterUserLevel = observer<Props>(function EnterUserLevel(props) {
  const [levelCode, setLevelCode] = useState("");
  const onLevelCodeChanged = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLevelCode(e.target.value.replace(/\r|\n/g, ""));
    },
    []
  );

  const [isFormValidated, setIsFormValidated] = useState(false);
  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!form.checkValidity()) {
        setIsFormValidated(true);
        return;
      }
      console.log(levelCode);
    },
    [levelCode]
  );

  return (
    <Modal.Dialog className={cn(styles.dialog, props.className)}>
      <Modal.Header closeButton onHide={props.onClose}>
        <Modal.Title>User Level</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="levelCode"
          className={styles.codeForm}
          noValidate
          validated={isFormValidated}
          onSubmit={onFormSubmit}
        >
          <Form.Control
            className={styles.codeArea}
            size="sm"
            as="textarea"
            placeholder="Level Code"
            required
            spellCheck={false}
            value={levelCode}
            onChange={onLevelCodeChanged}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" form="levelCode">
          Enter
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
});
