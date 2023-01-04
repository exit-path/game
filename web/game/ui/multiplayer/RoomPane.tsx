import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { RemotePlayer, Room, RoomGameState } from "../../models/multiplayer";
import { useStore } from "../../store";
import { GameStore } from "../../store/game";
import { MultiplayerStore } from "../../store/multiplayer";
import styles from "./RoomPane.module.scss";

export interface RoomPaneProps {
  className?: string;
  multiplayer: MultiplayerStore;
  room: Room;
}

export const RoomPane = observer<RoomPaneProps>(function RoomPane(props) {
  const { className, multiplayer, room } = props;
  const { game, modal } = useStore();
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
          multiplayer?.setNextLevel(String(level));
        },
      })
    );
  }, [modal, modalId, multiplayer]);

  const isInGame = room.id !== "lobby" && gameState.phase === "InGame";
  useEffect(() => {
    if (modalId != null && isInGame) {
      modal.dismiss(modalId);
      setModalId(null);
    }
  }, [isInGame, modal, modalId]);

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [menuContainerElement, setMenuContainerElement] =
    useState<HTMLElement | null>(null);
  const onOpenMenu = useCallback(() => {
    setIsMenuOpened(true);
  }, []);
  const onCloseMenu = useCallback(() => {
    setIsMenuOpened(false);
    game.focus();
  }, [game]);
  useEffect(() => {
    if (!isMenuOpened) {
      return;
    }

    const onDocumentClick = (e: Event) => {
      if (
        e.target instanceof Element &&
        !menuContainerElement?.contains(e.target)
      ) {
        setIsMenuOpened(false);
      }
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [isMenuOpened, menuContainerElement]);

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
            <div className={styles.levelBtnList}>
              {gameState.phase === "Lobby" && (
                <button
                  className={styles.levelBtn}
                  type="button"
                  onClick={onEditLevel}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
              )}
              <div
                ref={setMenuContainerElement}
                className={cn(
                  styles.menuContainer,
                  isMenuOpened && styles.menuContainerOpened
                )}
              >
                <button
                  className={cn(styles.levelBtn, styles.menuBtn)}
                  type="button"
                  onClick={onOpenMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                <Menu
                  multiplayer={multiplayer}
                  room={room}
                  onCloseMenu={onCloseMenu}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <ul className={styles.playerList}>
        {room.players
          .filter((p) => !p.isSpectator)
          .map((p) => (
            <PlayerItem
              key={p.id}
              player={p}
              game={game}
              state={isInGame ? gameState : null}
            />
          ))}
        {room.players.some((p) => p.isSpectator) && (
          <>
            <li className={styles.spectatorHeader}>Spectators</li>
            {room.players
              .filter((p) => p.isSpectator)
              .map((p) => (
                <PlayerItem
                  key={p.id}
                  player={p}
                  game={game}
                  state={isInGame ? gameState : null}
                />
              ))}
          </>
        )}
      </ul>
    </div>
  );
});

interface MenuProps {
  multiplayer: MultiplayerStore;
  room: Room;
  onCloseMenu: () => void;
}

const Menu = observer<MenuProps>(function Menu(props) {
  const { multiplayer, room, onCloseMenu } = props;
  const gameState = room.state as RoomGameState;

  const id = multiplayer.conn.connectionId;
  const isSpectator =
    room.players.find((p) => p.id === id)?.isSpectator ?? true;

  const onResetCountdown = useCallback(() => {
    multiplayer.sendMessage("/resettime");
    onCloseMenu();
  }, [multiplayer, onCloseMenu]);

  const onStartGame = useCallback(() => {
    multiplayer.sendMessage("/start");
    onCloseMenu();
  }, [multiplayer, onCloseMenu]);

  const onEndGame = useCallback(() => {
    multiplayer.sendMessage("/endgame");
    onCloseMenu();
  }, [multiplayer, onCloseMenu]);

  const restartLevel = useCallback(
    async (level: string) => {
      await multiplayer.sendMessage("/endgame");
      await multiplayer.setNextLevel(level);
      await new Promise((resolve) => setTimeout(() => resolve(0), 500));
      await multiplayer.sendMessage("/start");
    },
    [multiplayer]
  );
  const onRestartLevel = useCallback(() => {
    const level = gameState.nextLevelCode || String(gameState.nextLevel);
    restartLevel(level);
    onCloseMenu();
  }, [gameState, restartLevel, onCloseMenu]);

  return (
    <ul className={styles.menu}>
      {gameState.phase === "Lobby" && (
        <>
          <li className={styles.menuCommand}>
            <button
              type="button"
              className={styles.menuCommandBtn}
              onClick={onResetCountdown}
            >
              Reset Countdown
            </button>
          </li>
          <li className={styles.menuCommand}>
            <button
              type="button"
              className={styles.menuCommandBtn}
              onClick={onStartGame}
            >
              Start Game
            </button>
          </li>
        </>
      )}
      {gameState.phase === "InGame" && (
        <>
          <li className={styles.menuCommand}>
            <button
              type="button"
              className={styles.menuCommandBtn}
              onClick={onEndGame}
              disabled={isSpectator}
            >
              End Game
            </button>
          </li>
          <li className={styles.menuCommand}>
            <button
              type="button"
              className={styles.menuCommandBtn}
              onClick={onRestartLevel}
              disabled={isSpectator}
            >
              Restart Level
            </button>
          </li>
        </>
      )}
    </ul>
  );
});

interface PlayerItemProps {
  player: RemotePlayer;
  game: GameStore;
  state: RoomGameState | null;
}

const PlayerItem = observer<PlayerItemProps>(function PlayerItem(props) {
  const { id, name, color } = props.player;
  const { checkpoints, players, phase } = props.state ?? {};
  const nameStyle = React.useMemo(
    () => ({ color: "#" + color.toString(16).padStart(6, "0") }),
    [color]
  );

  const localID = players?.find((p) => p.id === id)?.localId;
  const numCheckpointsTaken =
    (checkpoints?.find((cp) => cp[0] === localID)?.length ?? 1) - 1;

  const numCheckpointsInGame = props.game.numCheckpoints;

  return (
    <li className={styles.playerItem} title={name}>
      <span className={styles.playerName} style={nameStyle}>
        {name}
      </span>
      {numCheckpointsInGame != null &&
        numCheckpointsInGame > 0 &&
        phase === "InGame" && (
          <span className={styles.checkpointsCount}>
            {numCheckpointsTaken}/{numCheckpointsInGame} &#9873;
          </span>
        )}
    </li>
  );
});
