import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { RoomPane } from "./multiplayer/RoomPane";

export interface SidePaneProps {
  className?: string;
}

export const SidePane = observer<SidePaneProps>(function SidePane(props) {
  const { game } = useStore();

  if (game.multiplayer?.room) {
    return (
      <RoomPane
        className={props.className}
        multiplayer={game.multiplayer}
        room={game.multiplayer.room}
      />
    );
  } else {
    return null;
  }
});
