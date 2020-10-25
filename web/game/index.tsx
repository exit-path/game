import React, { useEffect, useState } from "react";
import { Game, GameProps } from "./ui/Game";
import { StoreProvider } from "./store";
import { RootStore } from "./store/root";

const GameRoot: React.FC<GameProps> = (props) => {
  const [rootStore] = useState(() => new RootStore());

  useEffect(() => {
    return () => rootStore.dispose();
  }, [rootStore]);

  return (
    <StoreProvider value={rootStore}>
      <Game {...props} />
    </StoreProvider>
  );
};

export default GameRoot;
