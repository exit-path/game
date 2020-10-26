import React from "react";
import { Modal } from "react-bootstrap";
import { observer } from "mobx-react-lite";

interface Props {
  className?: string;
  onClose: () => void;
}

export const EnterUserLevel = observer<Props>(function EnterUserLevel(props) {
  return (
    <Modal.Dialog className={props.className}>
      <Modal.Header closeButton onHide={props.onClose}>
        <Modal.Title>User Level</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal.Dialog>
  );
});
