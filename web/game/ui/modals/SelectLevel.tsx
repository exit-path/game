import React, { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ResolverResult, useForm } from "react-hook-form";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { parse, validate } from "../../../../shared/level";
import { useStore } from "../../store";
import styles from "./SelectLevel.module.scss";

interface Props {
  className?: string;
  modalId: number;
  onEnterLevel: (level: string | number) => void;
}

interface FormData {
  levelType: "game-level" | "user-level";
  gameLevel: string;
  levelCode: string;
}

const levelCodeTrimRegex = /^\s*(!custom\s*)?|\s*$|\r|\n/g;

const builtinGameLevels = {
  0: "Getting Out 1",
  1: "Getting Out 2",
  2: "Getting Out 3",
  3: "The Stadium 1",
  4: "The Stadium 2",
  5: "The Stadium 3",
  6: "The Stadium 4",
  7: "The Stadium 5",
  8: "The Stadium 6",
  9: "The Stadium 7",
  10: "The Audit",
  11: "Lab Testing 1",
  12: "Lab Testing 2",
  13: "Lab Testing 3",
  14: "Lab Testing 4",
  15: "The Path to Freedom 1",
  16: "The Path to Freedom 2",
  17: "Backrooms 1",
  18: "Backrooms 2",
  19: "Backrooms 3",
  20: "Outside 1",
  21: "Outside 2",
  22: "Outside 3",
  23: "Outside 4",
  24: "Outside 5",
  25: "Skyline City Limits 1",
  26: "Skyline City Limits 2",
  27: "Skyline City Limits 3",
  28: "Skyline City Limits 4",
  29: "Skyline City Limits 5",
  30: "Ending",
  100: "Marathon",
  101: "Front Door",
  102: "Crossroads",
  103: "Tubes",
  104: "Death Wall",
  105: "The Maze",
  106: "Lunge",
  107: "Unfriendly Teleporters",
  108: "Funk",
  109: "Cubicles",
  110: "Over and Under",
  111: "Zipper",
  112: "Jumper",
  113: "Slip and Slide",
  114: "Wombat",
  115: "Fuzz Balls",
  116: "Secret Staircase",
  117: "Cubey",
  118: "Descending",
  119: "Treadmillvania",
};

export const SelectLevel = observer<Props>(function SelectLevel(props) {
  const { modalId, onEnterLevel } = props;
  const { modal } = useStore();

  const resolveForm = useCallback(
    (values: FormData): ResolverResult<FormData> => {
      if (values.levelType === "game-level") {
        return { values, errors: {} };
      } else {
        try {
          const level = parse(values.levelCode.replace(levelCodeTrimRegex, ""));
          validate(level);
          return { values, errors: {} };
        } catch (e) {
          return {
            values: {},
            errors: { levelCode: { type: "validate", message: String(e) } },
          };
        }
      }
    },
    []
  );

  const { register, handleSubmit, errors, formState, setValue } =
    useForm<FormData>({
      defaultValues: {
        levelType: "game-level",
        gameLevel: "0",
        levelCode: "",
      },
      resolver: resolveForm,
    });

  const onClose = useCallback(() => {
    modal.dismiss(modalId);
  }, [modal, modalId]);

  const onGameLevelChange = useCallback(() => {
    setValue("levelType", "game-level");
  }, [setValue]);

  const onUserLevelFocus = useCallback(() => {
    setValue("levelType", "user-level");
  }, [setValue]);

  const onFormSubmit = useCallback(
    (data: FormData) => {
      modal.dismiss(modalId);
      if (data.levelType === "game-level") {
        onEnterLevel(Number(data.gameLevel) ?? 0);
      } else {
        onEnterLevel(data.levelCode.replace(levelCodeTrimRegex, ""));
      }
    },
    [modal, modalId, onEnterLevel]
  );

  return (
    <Modal.Dialog className={cn(styles.dialog, props.className)}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Select Level</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="levelCode"
          className={styles.form}
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Form.Group className={styles.gameLevel}>
            <Form.Check
              type="radio"
              name="levelType"
              label="Game level"
              id="gameLevel"
              value="game-level"
              ref={register}
            />
            <Form.Control
              as="select"
              className={styles.levelSelector}
              name="gameLevel"
              onChange={onGameLevelChange}
              ref={register}
            >
              {Object.entries(builtinGameLevels).map(([num, name]) => (
                <option key={num} value={num}>
                  {name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className={styles.userLevel}>
            <Form.Check
              type="radio"
              name="levelType"
              label="User level"
              id="userLevel"
              value="user-level"
              ref={register}
            />
            <Form.Control
              name="levelCode"
              className={styles.codeArea}
              size="sm"
              as="textarea"
              placeholder="Level Code"
              spellCheck={false}
              isValid={formState.isSubmitted && !errors.levelCode}
              isInvalid={formState.isSubmitted && !!errors.levelCode}
              onFocus={onUserLevelFocus}
              ref={register}
            />
          </Form.Group>
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
