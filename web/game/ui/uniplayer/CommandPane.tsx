import React, { useCallback, useState } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { parse } from "../../../../shared/level";
import { useStore } from "../../store";
import styles from "./CommandPane.module.scss";

export interface CommandPaneProps {
  className?: string;
}

export const CommandPane = observer<CommandPaneProps>(function CommandPane(
  props
) {
  const { modal, game } = useStore();
  const { className } = props;

  const [modalId, setModalId] = useState<number | null>(null);

  const onPractice = useCallback(() => {
    if (modal.instances.some((i) => i.id === modalId)) {
      return;
    }

    setModalId(
      modal.present({
        type: "select-level",
        onEnterLevel: (level) => {
          game.focus();
          game.stage?.__withContext(() => {
            if (typeof level === "number") {
              game.main?.startPracticeLevel(level);
            } else {
              game.main?.setUserLevel(parse(level));
              game.main?.startPracticeLevel(999);
            }
          })();
        },
      })
    );
  }, [modal, modalId, game]);

  return (
    <div className={cn(className, styles.pane)}>
      <h2 className={styles.title}>Commands</h2>
      <button type="button" className={styles.action} onClick={onPractice}>
        Practice Level
      </button>
    </div>
  );
});
