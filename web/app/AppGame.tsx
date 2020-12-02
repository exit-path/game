import React from "react";
import { GameController } from "./controller";
import { Game } from "./Game";
import styles from "./AppGame.module.scss";

interface Props {
  controller: GameController;
}

export const AppGame: React.FC<Props> = (props) => {
  return (
    <main className={styles.app}>
      <Game className={styles.game} controller={props.controller} />
    </main>
  );
};
