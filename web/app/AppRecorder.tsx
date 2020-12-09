import React, { useCallback, useEffect, useState } from "react";
import { autorun, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { GameController } from "./controller";
import { Game } from "./Game";
import { decodeRecording, encodeRecording } from "./recording";
import { SWFRecorder } from "./swf-recorder";
import styles from "./AppRecorder.module.scss";

interface ReplayRecord {
  playerX: number;
  playerY: number;
  otherX: number;
  otherY: number;
  a: number;
  b: number;
}

interface PositionListProps {
  source: { replayRecords: ReplayRecord[] } | undefined;
}

const PositionList: React.FC<PositionListProps> = observer((props) => {
  const records = props.source?.replayRecords ?? [];

  const [text, setText] = useState("");
  const refresh = useCallback(() => {
    const records = props.source?.replayRecords ?? [];
    const text = records
      .map((p, i) =>
        [
          i,
          p.playerX.toFixed(2),
          p.playerY.toFixed(2),
          p.otherX.toFixed(2),
          p.otherY.toFixed(2),
          p.a.toFixed(20),
          p.b.toFixed(20),
        ].join("\t")
      )
      .join("\n");
    setText(text);
  }, [props.source]);

  return (
    <div className={styles.positions}>
      <div className={styles.header}>
        <span className={styles.frame}>{records.length}</span>
        <button onClick={refresh}>Refresh</button>
      </div>
      <textarea className={styles.list} value={text} readOnly={true} />
    </div>
  );
});

interface Props {
  controller: GameController;
}

export const AppRecorder: React.FC<Props> = observer((props) => {
  const { controller } = props;
  const [swfController] = useState(() => new SWFRecorder());
  const [level, setLevel] = useState(1);
  const [recording, setRecording] = useState("");

  const onLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLevel(Number(e.target.value));
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

  const onStartRecordHTML5 = useCallback(
    () =>
      runInAction(() => {
        controller.root?.recorder.startRecord();
        controller.root?.recorder.startSPGame(level - 1);
      }),
    [controller, level]
  );

  const onStartRecordSWF = useCallback(
    () =>
      runInAction(() => {
        swfController.startRecord();
        swfController.startSPGame(level - 1);
      }),
    [swfController, level]
  );

  const onStartReplay = useCallback(
    () =>
      runInAction(() => {
        if (!controller.root) {
          return;
        }
        controller.root.recorder.recording = decodeRecording(recording);
        controller.root.recorder.startReplay();
        swfController.recording = decodeRecording(recording);
        swfController.startReplay();

        setTimeout(() => {
          controller.root?.recorder.startSPGame(level - 1);
          swfController.startSPGame(level - 1);
        }, 0);
      }),
    [controller, swfController, recording, level]
  );

  const onStop = useCallback(
    () =>
      runInAction(() => {
        if (controller.root?.recorder.mode === "replaying") {
          controller.root.recorder.stopReplay();
        } else if (controller.root?.recorder.mode === "recording") {
          controller.root?.recorder.stopRecord();
        }
        if (swfController.mode === "replaying") {
          swfController.stopReplay();
        } else if (swfController.mode === "recording") {
          swfController.stopRecord();
        }
      }),
    [controller, swfController]
  );

  useEffect(
    () =>
      autorun(() => {
        if (controller.root?.recorder.mode === "recording") {
          setRecording(encodeRecording(controller.root.recorder.recording));
        } else if (swfController.mode === "recording") {
          setRecording(encodeRecording(swfController.recording));
        }
      }),
    [controller, swfController]
  );

  const swfMode = swfController.mode;
  const html5Mode = controller.root?.recorder.mode ?? null;
  const isBusy = !!(swfMode || html5Mode);

  return (
    <main className={styles.app}>
      <Game className={styles.gameA} controller={controller} />
      <object
        className={styles.gameB}
        ref={swfController.setGame}
        type="application/x-shockwave-flash"
        data="/game.swf"
        width="800"
        height="500"
      >
        <param name="wmode" value="direct" />
        <param name="allowScriptAccess" value="always" />
      </object>

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
            max={200}
            value={level}
            onChange={onLevelChange}
          />
        </div>
        <button onClick={onStartRecordHTML5} disabled={isBusy}>
          Start record (HTML5)
        </button>
        <button onClick={onStartRecordSWF} disabled={isBusy}>
          Start record (SWF)
        </button>
        <button onClick={onStartReplay} disabled={isBusy}>
          Start replay
        </button>
        <button onClick={onStop} disabled={!isBusy}>
          Stop
        </button>
      </div>
      <div className={styles.result}>
        <textarea
          className={styles.recording}
          value={recording}
          disabled={isBusy}
          onChange={onRecordingChange}
        />
        <PositionList source={controller.root?.recorder} />
        <PositionList source={swfController} />
      </div>
    </main>
  );
});
