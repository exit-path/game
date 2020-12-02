import React, { useCallback, useState } from "react";
import { GameController } from "./controller";
import { Game } from "./Game";
import styles from "./AppRecorder.module.scss";

interface Props {
  controller: GameController;
}

export const AppRecorder: React.FC<Props> = (props) => {
  const { controller } = props;
  const [level, setLevel] = useState(1);

  const onLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLevel(Math.min(30, Math.max(1, Number(e.target.value))));
    },
    []
  );

  const onStart = useCallback(() => {
    controller.root?.recorder.startSPGame(level - 1);
  }, [controller, level]);

  return (
    <main className={styles.app}>
      <Game className={styles.gameA} controller={controller} />
      <div className={styles.ctrl}>
        <div className={styles.field}>
          <label htmlFor="level" className={styles.label}>
            Level
          </label>
          <input
            id="level"
            className={styles.input}
            type="number"
            min={1}
            max={30}
            value={level}
            onChange={onLevelChange}
          />
        </div>
        <button onClick={onStart}>Start record</button>
      </div>
      <div className={styles.result}></div>
    </main>
  );
};
