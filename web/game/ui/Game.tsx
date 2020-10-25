import React, { useEffect } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { GameArea } from "./GameArea";
import styles from "./Game.module.scss";

export interface GameProps {
  className?: string;
}

export const Game: React.FC<GameProps> = observer(function Game(props) {
  const { library } = useStore();

  useEffect(() => {
    library.load();
  }, [library]);

  let loader: JSX.Element | null = null;
  if (library.loadError) {
    loader = <pre className={styles.error}>{library.loadError}</pre>;
  } else if (!library.value) {
    const percentage = `${(library.loadProgress * 100).toFixed(0)}%`;
    loader = <pre className={styles.loading}>Loading {percentage}...</pre>;
  }
  if (loader) {
    return <div className={cn(props.className, styles.loader)}>{loader}</div>;
  }

  return (
    <div className={cn(props.className, styles.game)}>
      <GameArea />
    </div>
  );
});
