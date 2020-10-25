import React, { useState } from "react";
import { Game, GameProps } from "./Game";
import { StoreProvider } from "./store";
import { RootStore } from "./store/root";

const GameRoot: React.FC<GameProps> = (props) => {
  const [rootStore] = useState(() => new RootStore());

  return (
    <StoreProvider value={rootStore}>
      <Game {...props} />
    </StoreProvider>
  );
};

export default GameRoot;
