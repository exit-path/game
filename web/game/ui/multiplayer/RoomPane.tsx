import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { RemotePlayer, Room, RoomGameState } from "../../models/multiplayer";
import { useStore } from "../../store";
import { MultiplayerStore } from "../../store/multiplayer";
import styles from "./RoomPane.module.scss";

export interface RoomPaneProps {
  className?: string;
  multiplayer: MultiplayerStore;
  room: Room;
}

export const RoomPane = observer<RoomPaneProps>(function RoomPane(props) {
  const { className, room } = props;
  const { modal, game } = useStore();
  const gameState = room.state as RoomGameState;

  const [modalId, setModalId] = useState<number | null>(null);
  const onEditLevel = useCallback(() => {
    if (modal.instances.some((i) => i.id === modalId)) {
      return;
    }

    setModalId(
      modal.present({
        type: "select-level",
        onEnterLevel: (level) => {
          game.multiplayer?.setNextLevel(String(level));
        },
      })
    );
  }, [modal, modalId, game]);

  const isInGame = room.id !== "lobby" && gameState.phase === "InGame";
  useEffect(() => {
    if (modalId != null && isInGame) {
      modal.dismiss(modalId);
      setModalId(null);
    }
  }, [isInGame, modal, modalId]);

  return (
    <div className={cn(className, styles.pane)}>
      <div className={styles.info}>
        <h2 className={styles.roomName} title={room.name}>
          {room.name}
        </h2>
        {room.id !== "lobby" && (
          <div className={styles.roomDetails}>
            <label className={styles.levelLabel}>Level: </label>
            <label
              className={styles.levelName}
              title={
                gameState.nextLevel === 999
                  ? gameState.nextLevelName
                  : String(gameState.nextLevel)
              }
            >
              {gameState.nextLevelName}
            </label>
            {gameState.phase === "Lobby" && (
              <button
                className={styles.editLevel}
                type="button"
                onClick={onEditLevel}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      <ul className={styles.playerList}>
        {room.players
          .filter((p) => !p.isSpectator)
          .map((p) => (
            <PlayerItem key={p.id} player={p} />
          ))}
        {room.players.some((p) => p.isSpectator) && (
          <>
            <li className={styles.spectatorHeader}>Spectators</li>
            {room.players
              .filter((p) => p.isSpectator)
              .map((p) => (
                <PlayerItem key={p.id} player={p} />
              ))}
          </>
        )}
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
