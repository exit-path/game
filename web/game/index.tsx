import React, { useEffect, useState } from "react";
import { StoreProvider } from "./store";
import { RootStore } from "./store/root";
import { Game, GameProps } from "./ui/Game";

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
