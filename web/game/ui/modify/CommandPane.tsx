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
  const { game, modal } = useStore();
  const { className } = props;

  const onChangeName = useCallback(() => {
    const main = game.main!;
    const userName = main.playerObj.userName;
    const newName =
      window.prompt("New user name (3-30 characters)", userName) ?? userName;
    if (/^[a-zA-Z0-9_]{3,30}$/.test(newName)) {
      main.playerObj.userName = newName;
    }
  }, [game]);

  const onKeybindings = useCallback(() => {
    modal.present({ type: "keybindings" });
  }, [modal]);

  return (
    <div className={cn(className, styles.pane)}>
      <h2 className={styles.title}>Commands</h2>
      <button type="button" className={styles.action} onClick={onChangeName}>
        Change user name
      </button>
      <button type="button" className={styles.action} onClick={onKeybindings}>
        Keybindings
      </button>
    </div>
  );
});
