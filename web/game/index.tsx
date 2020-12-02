import React, { useEffect, useState } from "react";
import { Controller } from "./controller";
import { StoreProvider } from "./store";
import { RootStore } from "./store/root";
import { Game, GameProps } from "./ui/Game";

const GameRoot: React.FC<GameProps> = (props) => {
  const [rootStore, setRootStore] = useState<RootStore | null>(null);

  useEffect(() => {
    const s = new RootStore();
    setRootStore(s);
    return () => s.dispose();
  }, []);

  if (!rootStore) {
    return null;
  }

  return (
    <StoreProvider value={rootStore}>
      <Game {...props} />
    </StoreProvider>
  );
};

export default GameRoot;

export type { Controller };
