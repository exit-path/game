import React from "react";

const GameLoader = React.lazy(
  () => import(/* webpackChunkName: "game" */ "../game")
);

export const Game: React.FC = () => {
  return (
    <React.Suspense fallback={<p>Loading!</p>}>
      <GameLoader />
    </React.Suspense>
  );
};
