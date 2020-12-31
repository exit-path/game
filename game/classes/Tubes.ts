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

interface RoomState {
  players: GamePlayer[];
  phase: "Lobby" | "InGame";
  timer: number;
  nextLevel: number;
}

export class Tubes extends lib.flash.display.MovieClip {
  public locate = "QPL";

  public rankedPlayers: PlayerShell[] = [];
  public players: PlayerShell[] = [];
  public room: RoomState;
  public playerId: string;

  public get player() {
    return this.room.players.find((p) => p.id === this.playerId).data;
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
  }

  public ping() {
    let playerShell: PlayerShell;
    for (const { id, localId, data } of this.room.players) {
      let shell = this.players.find((p) => p.id === localId);
      if (!shell) {
        shell = new PlayerShell();
        shell.userName = data.displayName;
        shell.id = localId;
        shell.isPlayer = id === this.playerId;
        shell.placing = this.players.length;
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
      this.rankedPlayers = this.rankedPlayers.filter((p) => p !== shell);
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

  public onDeath() {}

  public onCheckpoint(id: string) {}

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
