import React, { useEffect, useRef, useState } from "react";
import lib from "swf-lib";
import cn from "classnames";
import { loadLibrary } from "./library";
import { MainTimeline } from "../../game/classes/Exit_fla/MainTimeline";
import styles from "./Game.module.scss";

interface GameProps {
  className?: string;
}

export const Game: React.FC<GameProps> = (props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [library, setLibrary] = useState<lib.__internal.AssetLibrary>();
  const [stage, setStage] = useState<lib.flash.display.Stage | null>(null);

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
    setStage(stage);

    const game: MainTimeline = library.instantiateCharacter(0);
    stage.addChild(game);
  }, [library]);

  useEffect(() => {
    if (stage && container.current) {
      const elem = stage.__canvas.container;
      container.current?.appendChild(elem);
      return () => elem.remove();
    }
  }, [stage, container]);

  let elem: JSX.Element | null = null;
  if (error) {
    elem = <pre className={styles.error}>{error}</pre>;
  } else if (!stage) {
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
