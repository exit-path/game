import React, { useEffect, useRef, useState } from "react";
import lib from "swf-lib";
import cn from "classnames";
import { loadLibrary } from "./library";
import { MainTimeline } from "../../game/classes/Exit_fla/MainTimeline";
import styles from "./Game.module.scss";

interface GameProps {
  className?: string;
}

interface StageRef {
  stage: lib.flash.display.Stage | null;
}

// Use a standalone function to avoid capturing stage directly in closure,
// since effect destroy function may be kept internally temporarily.
function disposeStage(ref: StageRef): () => void {
  return () => {
    ref.stage?.__canvas.container.remove();
    ref.stage?.__dispose();
    ref.stage = null;
  };
}

export const Game: React.FC<GameProps> = (props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [library, setLibrary] = useState<lib.__internal.AssetLibrary>();
  const [stageRef, setStageRef] = useState<StageRef | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLibrary((progress) => setProgress(progress))
      .then((lib) => !cancelled && setLibrary(lib))
      .catch((err) => setError(String(err)));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!library) {
      return;
    }

    const stage = new lib.flash.display.Stage(library.properties);
    const ref: StageRef = { stage };
    setStageRef(ref);

    stage.__withContext(() => {
      const game: MainTimeline = library.instantiateCharacter(0);
      stage.addChild(game);
    })();

    if (container.current) {
      container.current?.appendChild(stage.__canvas.container);
    }

    return disposeStage(ref);
  }, [library]);

  let elem: JSX.Element | null = null;
  if (error) {
    elem = <pre className={styles.error}>{error}</pre>;
  } else if (!stageRef?.stage) {
    const percentage =
      progress != null ? ` ${(progress * 100).toFixed(0)}%` : "";
    elem = <pre className={styles.loading}>Loading{percentage}...</pre>;
  }

  return (
    <div className={cn(props.className, styles.game)} ref={container}>
      {elem}
    </div>
  );
};
