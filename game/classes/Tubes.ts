import lib from "swf-lib";
import { PlayerShell } from "./PlayerShell";
import { Relay } from "./john/Relay";
import { PlayerBar } from "./PlayerBar";
import { ExternalEvent } from "./ExternalEvent";
import type { Multiplayer } from "./Multiplayer";
import { SoundBox } from "./john/SoundBox";

interface PlayerData {
  displayName: string;
  primaryColor: number;
  secondaryColor: number;
  headType: number;
  handType: number;
  xp: number;
  kudos: number;
  matches: number;
  wins: number;
}

interface GamePlayer {
  id: string;
  localId: number;
  data: PlayerData;
}

export type GamePlayerPosition = [
  id: number,
  v: number,
  x: number,
  y: number,
  fr: number,
  sx: number,
  t: number
];

export type GamePlayerCheckpoints = [id: number, ...checkpoints: number[]];

interface RoomState {
  players: GamePlayer[];
  phase: "Lobby" | "InGame";
  timer: number;
  nextLevel: number;
  positions: GamePlayerPosition[];
  checkpoints: GamePlayerCheckpoints[];
}

export class Tubes extends lib.flash.display.MovieClip {
  public locate = "QPL";

  public room: RoomState;
  public playerId: string;
  public readonly players: PlayerShell[] = [];
  public readonly rankedPlayers: PlayerShell[] = [];
  public readonly playerMap = new Map<number, PlayerShell>();
  public readonly positionVersions = new Map<number, number>();

  private ticks: number = 0;
  private lastReportedPosition: GamePlayerPosition | null = null;
  private lastReportTick: number = 0;

  public get player() {
    return this.room.players.find((p) => p.id === this.playerId)?.data;
  }

  private get multiplayer() {
    return this.parent as Multiplayer;
  }

  public constructor() {
    super();
  }

  public init(room: RoomState, playerId: string) {
    this.room = room;
    this.playerId = playerId;

    this.players.length = 0;
    this.rankedPlayers.length = 0;
    this.playerMap.clear();
    this.positionVersions.clear();

    this.lastReportedPosition = null;
    this.lastReportTick = 0;
  }

  public ping() {
    this.ticks++;

    let playerShell: PlayerShell;
    for (const { id, localId, data } of this.room.players) {
      let shell = this.playerMap.get(localId);
      if (!shell) {
        shell = new PlayerShell();
        shell.userName = data.displayName;
        shell.id = localId;
        shell.isPlayer = id === this.playerId;
        shell.placing = this.players.length;
        this.playerMap.set(localId, shell);
        this.players.push(shell);
        this.rankedPlayers.push(shell);

        this.multiplayer.lobby?.addBar();
      }

      shell.level = this.multiplayer.getLevelByXP(data.xp);
      shell.xp = data.xp;
      shell.kudos = data.kudos;
      shell.wins = data.wins;
      shell.matches = data.matches;
      shell.colour = data.primaryColor;
      shell.colour2 = data.secondaryColor;
      shell.headType = data.headType;
      shell.handType = data.handType;
      if (shell.isPlayer) {
        playerShell = shell;
      }
    }
    for (let i = 0; i < this.players.length; i++) {
      const shell = this.players[i];
      if (this.room.players.some((p) => p.localId === shell.id)) {
        continue;
      }

      this.multiplayer.lobby?.removeBar(i);
      this.multiplayer.game?.tRemovePlayer(shell.id);

      this.players.splice(i, 1);
      this.rankedPlayers.splice(this.rankedPlayers.indexOf(shell), 1);
      this.playerMap.delete(shell.id);
    }
    for (let i = 0; i < this.players.length; i++) {
      this.multiplayer.lobby?.updateBar(i);
    }

    switch (this.room.phase) {
      case "Lobby":
        if (this.locate != "Lobby") {
          break;
        }
        if (this.multiplayer.lobby.timeToGo !== this.room.timer) {
          this.multiplayer.lobby.timeToGo = this.room.timer;
          if (this.room.timer <= 5) {
            SoundBox.playSound("Boop1");
          }
        }
        break;

      case "InGame":
        if (this.locate != "Game") {
          playerShell.kudosToGive = 0;
          SoundBox.playSound("Boop2");
          this.dispatchEvent(new Relay(Relay.GOTO, "Lobby", "StartGame"));
          break;
        }

        const position: GamePlayerPosition = [
          playerShell.id,
          this.ticks,
          Math.round(playerShell.xPos),
          Math.round(playerShell.yPos),
          playerShell.fr,
          playerShell.xScale,
          playerShell.time,
        ];
        let needReport = false;
        if (this.lastReportedPosition && this.ticks > this.lastReportTick + 6) {
          for (let i = 2; i < position.length; i++) {
            if (position[i] !== this.lastReportedPosition[i]) {
              needReport = true;
              break;
            }
          }
        } else if (!this.lastReportedPosition) {
          needReport = true;
        }

        if (needReport) {
          this.lastReportedPosition = position;
          this.lastReportTick = this.ticks;
          this.dispatchEvent(
            new ExternalEvent({
              type: "report-position",
              position,
            })
          );
        }

        for (const [id, v, x, y, fr, sx] of this.room.positions) {
          const shell = this.playerMap.get(id);
          if (!shell || shell === playerShell) {
            continue;
          }

          if (this.positionVersions.get(shell.id) === v) {
            continue;
          }

          shell.oldX = shell.xPos;
          shell.oldY = shell.yPos;
          shell.xPos = x;
          shell.yPos = y;
          shell.fr = fr;
          shell.xScale = sx;
          this.positionVersions.set(shell.id, v);
          shell.tCounter = 0;
          shell.tCounterGoal = 6;
          if (shell.xPos !== shell.oldX) {
            shell.xV = (shell.xPos - shell.oldX) / shell.tCounterGoal;
          } else {
            shell.xV = 0;
          }
          if (shell.yPos !== shell.oldY) {
            shell.yV = (shell.yPos - shell.oldY) / shell.tCounterGoal;
          } else {
            shell.yV = 0;
          }
        }

        for (const [id, ...cps] of this.room.checkpoints) {
          const shell = this.playerMap.get(id);
          if (!shell || shell === playerShell) {
            continue;
          }

          for (const cp of cps) {
            this.multiplayer.game?.tCheck(id, cp);
          }
        }

        break;
    }
  }

  public disconnect() {
    this.dispatchEvent(
      new ExternalEvent({
        type: "disconnect-multiplayer",
      })
    );
  }

  public onConnectionLost() {
    this.dispatchEvent(new Relay(Relay.GOTO, "Tubes", "TimeOut"));
  }

  public onCheckpoint(id: number) {
    this.dispatchEvent(
      new ExternalEvent({
        type: "report-checkpoint",
        id,
      })
    );
  }

  public onFinishGame() {}

  public onEndGame(placings: PlayerBar[]) {}

  public giveKudo(player: PlayerShell) {}

  public onPlayerLevelUp(level: number, levelName: string) {}

  public isPlayerMuted(player: PlayerShell): boolean {
    return false;
  }

  public unMutePlayer(player: PlayerShell) {}

  public mutePlayer(player: PlayerShell) {}
}
