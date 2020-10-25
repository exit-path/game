import React, { useContext } from "react";
import { RootStore } from "./root";

const Context = React.createContext<RootStore | null>(null);

export const StoreProvider = Context.Provider;

export function useStore(): RootStore {
  const value = useContext(Context);
  if (!value) {
    throw new Error("Root store is not provided");
  }
  return value;
}
