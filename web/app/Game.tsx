import React from "react";
import cn from "classnames";
import styles from "./Game.module.scss";

const GameLoader = React.lazy(
  () => import(/* webpackChunkName: "game" */ "../game")
);

interface GameProps {
  className?: string;
}

export const Game: React.FC<GameProps> = (props) => {
  return (
    <React.Suspense
      fallback={
        <div className={cn(props.className, styles.placeholder)}>
          <pre>Loading...</pre>
        </div>
      }
    >
      <GameLoader className={props.className} />
    </React.Suspense>
  );
};
