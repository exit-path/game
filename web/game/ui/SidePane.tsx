import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store";
import { CommandPane as CommandPaneModify } from "./modify/CommandPane";
import { RoomPane } from "./multiplayer/RoomPane";
import { CommandPane as CommandPaneUniplayer } from "./uniplayer/CommandPane";

export interface SidePaneProps {
  className?: string;
}

export const SidePane = observer<SidePaneProps>(function SidePane(props) {
  const { game } = useStore();

  if (game.isInSPMenu) {
    return <CommandPaneUniplayer className={props.className} />;
  } else if (game.isInModify) {
    return <CommandPaneModify className={props.className} />;
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
