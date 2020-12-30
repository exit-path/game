import React from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { RemotePlayer, Room } from "../../models/multiplayer";
import { MultiplayerStore } from "../../store/multiplayer";
import styles from "./RoomPane.module.scss";

export interface RoomPaneProps {
  className?: string;
  multiplayer: MultiplayerStore;
  room: Room;
}

export const RoomPane = observer<RoomPaneProps>(function RoomPane(props) {
  const { className, room } = props;

  return (
    <div className={cn(className, styles.pane)}>
      <div className={styles.info}>
        <h2 className={styles.roomName} title={room.name}>
          {room.name}
        </h2>
      </div>
      <ul className={styles.playerList}>
        {room.players.map((p) => (
          <PlayerItem key={p.id} player={p} />
        ))}
      </ul>
    </div>
  );
});

interface PlayerItemProps {
  player: RemotePlayer;
}

const PlayerItem = observer<PlayerItemProps>(function PlayerItem(props) {
  const { name, color } = props.player;
  const nameStyle = React.useMemo(
    () => ({ color: "#" + color.toString(16).padStart(6, "0") }),
    [color]
  );

  return (
    <li className={styles.playerItem} title={name}>
      <span className={styles.playerName} style={nameStyle}>
        {name}
      </span>
    </li>
  );
});
