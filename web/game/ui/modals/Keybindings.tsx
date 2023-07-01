import React, { useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import { defaultKeybindings } from "game/store/keybindings";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import styles from "./Keybindings.module.scss";

interface Props {
  className?: string;
  modalId: number;
}

export const Keybindings = observer<Props>(function WhatsNew(props) {
  const { modalId } = props;
  const { modal, keybindings } = useStore();

  const onClose = useCallback(() => {
    modal.dismiss(modalId);
  }, [modal, modalId]);

  const onReset = useCallback(() => {
    keybindings.reset();
  }, [keybindings]);

  return (
    <Modal.Dialog className={props.className}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Keybindings</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.body}>
        <table className={styles.table}>
          <KeybindingEntry label="Respawn" keybinding="kill" />
          <KeybindingEntry label="Toggle pause" keybinding="pause" />
          <KeybindingEntry label="Toggle focus mode" keybinding="focus" />
          <KeybindingEntry label="Toggle beam" keybinding="beam" />
        </table>
        <Button variant="secondary" type="button" onClick={onReset}>
          Reset
        </Button>
      </Modal.Body>
    </Modal.Dialog>
  );
});

const keys = [
  "Digit0",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "KeyA",
  "KeyB",
  "KeyC",
  "KeyD",
  "KeyE",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "KeyM",
  "KeyN",
  "KeyO",
  "KeyP",
  "KeyQ",
  "KeyR",
  "KeyS",
  "KeyT",
  "KeyU",
  "KeyV",
  "KeyW",
  "KeyX",
  "KeyY",
  "KeyZ",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "F13",
  "F14",
  "F15",
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "NumpadAdd",
  "NumpadDecimal",
  "NumpadDivide",
  "NumpadEnter",
  "NumpadMultiply",
  "NumpadSubtract",
  "Home",
  "Insert",
  "Semicolon",
  "Equal",
  "Comma",
  "Minus",
  "Period",
  "Slash",
  "Backquote",
  "BracketLeft",
  "Backslash",
  "BracketRight",
  "Quote",
  "Backspace",
  "CapsLock",
  "Delete",
  "End",
  "Enter",
  "Escape",
  "PageDown",
  "PageUp",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "AltLeft",
  "AltRight",
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "Space",
  "Tab",
];

interface KeybindingEntryProps {
  label: string;
  keybinding: keyof typeof defaultKeybindings;
}

const KeybindingEntry = observer<KeybindingEntryProps>(function KeybindingEntry(
  props
) {
  const { label, keybinding } = props;
  const { keybindings } = useStore();
  const key = keybindings[keybinding];

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      runInAction(() => {
        keybindings[keybinding] = e.currentTarget.value;
      });
    },
    [keybindings, keybinding]
  );

  return (
    <tr>
      <th className={styles.cell}>
        <label className={styles.entryLabel}>{label}</label>
      </th>
      <td>
        <select value={key} onChange={onChange}>
          {keys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
});
