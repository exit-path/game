import React, { useCallback, useEffect, useState } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { GameController } from "./controller";
import { Game } from "./Game";
import styles from "./AppRecorder.module.scss";

interface Props {
  controller: GameController;
}

export const AppRecorder: React.FC<Props> = observer((props) => {
  const { controller } = props;
  const [level, setLevel] = useState(1);
  const [recording, setRecording] = useState("");

  const onLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLevel(Math.min(30, Math.max(1, Number(e.target.value))));
    },
    []
  );

  const onRecordingChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!controller.root?.recorder.mode) {
        setRecording(e.target.value);
      }
    },
    [controller]
  );

  const onStartRecord = useCallback(
    () =>
      runInAction(() => {
        if (!controller.root) {
          return;
        }
        controller.root.recorder.startSPGame(level - 1);
        controller.root.recorder.mode = "recording";
      }),
    [controller, level]
  );

  const onStartReplay = useCallback(
    () =>
      runInAction(() => {
        if (!controller.root) {
          return;
        }
        controller.root.recorder.startSPGame(level - 1);
        controller.recording = recording;
        controller.root.recorder.replayIndex = 0;
        controller.root.recorder.mode = "replaying";
      }),
    [controller, recording, level]
  );

  const onStop = useCallback(
    () =>
      runInAction(() => {
        if (!controller.root) {
          return;
        }
        controller.root.recorder.mode = null;
      }),
    [controller]
  );

  useEffect(
    () =>
      autorun(() => {
        if (!controller.root) {
          return;
        }
        if (controller.root.recorder.mode === "recording") {
          setRecording(controller.recording);
        }
      }),
    [controller]
  );

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
        <button onClick={onStartRecord}>Start record</button>
        <button onClick={onStartReplay}>Start replay</button>
        <button onClick={onStop}>Stop</button>
      </div>
      <div className={styles.result}>
        <textarea
          className={styles.recording}
          value={recording}
          disabled={!!controller.root?.recorder.mode}
          onChange={onRecordingChange}
        />
      </div>
    </main>
  );
});
