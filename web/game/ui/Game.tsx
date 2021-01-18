import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Controller } from "../controller";
import { useStore } from "../store";
import { BottomPane } from "./BottomPane";
import { GameArea } from "./GameArea";
import { ModalContainer } from "./ModalContainer";
import { SidePane } from "./SidePane";
import styles from "./Game.module.scss";

export interface GameProps {
  className?: string;
  controller?: Controller;
}

export const Game: React.FC<GameProps> = observer(function Game(props) {
  const { controller } = props;

  const root = useStore();
  const { library } = root;

  useEffect(() => {
    library.load();
  }, [library]);

  useEffect(() => {
    if (controller) {
      action(() => {
        controller.setRoot(root);
        root.controller = controller;
      })();
      return action(() => {
        root.controller = null;
        controller.setRoot(null);
      });
    }
  }, [controller, root]);

  const [isFocusMode, setIsFocusMode] = useState(false);
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key.toUpperCase() === "F") {
      setIsFocusMode((v) => !v);
    }
  }, []);

  const [gameWrapper, setGameWrapper] = useState<HTMLElement | null>(null);
  const [gameStyles, setGameStyles] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (!gameWrapper) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === gameWrapper) {
          const { width, height } = entry.contentRect;
          const aspectRatio = width / height;
          if (aspectRatio > 800 / 500) {
            setGameStyles({
              width: `${(height * 800) / 500}px`,
              height: `${height}px`,
            });
          } else {
            setGameStyles({
              width: `${width}px`,
              height: `${(width * 500) / 800}px`,
            });
          }
        }
      }
    });
    observer.observe(gameWrapper);
    return () => observer.disconnect();
  }, [gameWrapper]);

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
    <div
      className={cn(
        styles.root,
        props.className,
        isFocusMode && styles.focusMode
      )}
      onKeyDown={onKeyDown}
    >
      <div ref={setGameWrapper} className={styles.game}>
        <div style={gameStyles}>
          <ModalContainer className={styles.gameContainer}>
            <GameArea />
          </ModalContainer>
        </div>
      </div>
      <SidePane className={styles.side} />
      <BottomPane className={styles.bottom} />
    </div>
  );
});
