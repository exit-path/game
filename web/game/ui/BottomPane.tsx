import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { ChatPane } from "./multiplayer/ChatPane";

export interface BottomPaneProps {
  className?: string;
}

export const BottomPane = observer<BottomPaneProps>(function BottomPane(props) {
  const { game } = useStore();

  if (game.multiplayer?.room) {
    return (
      <ChatPane className={props.className} multiplayer={game.multiplayer} />
    );
  } else {
    return null;
  }
});
