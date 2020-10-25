import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { useStore } from "../store";
import styles from "./GameArea.module.scss";

export interface GameAreaProps {
  className?: string;
}

export const GameArea = observer<GameAreaProps>(function GameArea(props) {
  const { game } = useStore();

  useEffect(() => {
    game.start();
  }, [game]);

  return (
    <div className={cn(props.className, styles.game)} ref={game.setContainer} />
  );
});
