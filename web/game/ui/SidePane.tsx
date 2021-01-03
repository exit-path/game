import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { RoomPane } from "./multiplayer/RoomPane";
import { CommandPane } from "./uniplayer/CommandPane";

export interface SidePaneProps {
  className?: string;
}

export const SidePane = observer<SidePaneProps>(function SidePane(props) {
  const { game } = useStore();

  if (game.isInSPMenu) {
    return <CommandPane className={props.className} />;
  } else if (game.multiplayer?.room) {
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
