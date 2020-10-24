import React from "react";
import { Game } from "./Game";
import styles from "./App.module.scss";

export const App: React.FC = () => {
  return (
    <main className={styles.app}>
      <Game className={styles.game} />
    </main>
  );
};
