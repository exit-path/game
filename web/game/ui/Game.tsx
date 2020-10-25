import React, { useEffect } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { GameArea } from "./GameArea";
import { ModalContainer } from "./ModalContainer";
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
    loader = <p className={styles.error}>{library.loadError}</p>;
  } else if (!library.value) {
    const percentage = `${(library.loadProgress * 100).toFixed(0)}%`;
    loader = <p className={styles.loading}>Loading {percentage}...</p>;
  }
  if (loader) {
    return <div className={cn(styles.loader, props.className)}>{loader}</div>;
  }

  return (
    <div className={cn(styles.game, props.className)}>
      <ModalContainer>
        <GameArea />
      </ModalContainer>
    </div>
  );
});
