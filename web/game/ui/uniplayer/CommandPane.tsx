import React, { useCallback } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
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

  const onPractice = useCallback(() => {
    modal.present({
      type: "enter-user-level",
      onEnterLevel: (level) => {
        game.focus();
        game.stage?.__withContext(() => {
          game.main?.setUserLevel(level);
          game.main?.startPracticeLevel(999);
        })();
      },
    });
  }, [modal, game]);

  return (
    <div className={cn(className, styles.pane)}>
      <h2 className={styles.title}>Commands</h2>
      <button type="button" className={styles.action} onClick={onPractice}>
        Practice Level
      </button>
    </div>
  );
});
