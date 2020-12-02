import React, { useState } from "react";
import { GameController } from "./controller";
import { Game } from "./Game";
import styles from "./App.module.scss";

export const App: React.FC = () => {
  const [controller] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return new GameController(!!params.get("recorder"));
  });

  return (
    <main className={styles.app}>
      <Game className={styles.game} controller={controller} />
    </main>
  );
};
