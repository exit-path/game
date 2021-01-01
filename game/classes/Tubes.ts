import lib from "swf-lib";
import { PlayerShell } from "./PlayerShell";
import { Relay } from "./john/Relay";
import { ExternalEvent } from "./ExternalEvent";
import type { Multiplayer } from "./Multiplayer";
import { SoundBox } from "./john/SoundBox";
import { AchEvent } from "./AchEvent";

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

export interface GamePlayerReward {
  id: number;
  placing: number;
  matchXP: number;
  availableKudos: number;
  receivedKudos: number;
}

interface RoomState {
  players: GamePlayer[];
  phase: "Lobby" | "InGame";
  timer: number;
  nextLevel: number;
  positions: GamePlayerPosition[];
  checkpoints: GamePlayerCheckpoints[];
  rewards: GamePlayerReward[];
}

export class Tubes extends lib.flash.display.MovieClip {
  public locate = "QPL";

  public room: RoomState;
  public playerId: string;
  public readonly players: PlayerShell[] = [];
  public readonly playerMap = new Map<number, PlayerShell>();
  public readonly positionVersions = new Map<number, number>();

  private ticks: number = 0;
  private lastReportedPosition: GamePlayerPosition | null = null;
  private lastReportTick: number = 0;

  private lastXP: number = null;

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
    this.playerMap.clear();
    this.positionVersions.clear();

    this.lastReportedPosition = null;
    this.lastReportTick = 0;
  }

  public ping() {
    this.ticks++;

    let playerShell: PlayerShell;
    let needSave = false;
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

        if (this.multiplayer.lobby) {
          const oldXP = this.lastXP ?? data.xp;
          this.lastXP = data.xp;
          this.multiplayer.lobby.checkLevelUp(oldXP, data.xp);
        }

        if (this.multiplayer.playerObject.xp !== shell.xp) {
          this.multiplayer.playerObject.xp = shell.xp;
          needSave = true;
        }
        if (this.multiplayer.playerObject.kudos !== shell.kudos) {
          this.multiplayer.playerObject.kudos = shell.kudos;
          needSave = true;
        }
        if (this.multiplayer.playerObject.wins !== shell.wins) {
          this.multiplayer.playerObject.wins = shell.wins;
          needSave = true;
        }
        if (this.multiplayer.playerObject.matches !== shell.matches) {
          this.multiplayer.playerObject.matches = shell.matches;
          needSave = true;
        }
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
      this.playerMap.delete(shell.id);
    }

    for (const reward of this.room.rewards) {
      const shell = this.playerMap.get(reward.id);
      if (!shell) {
        continue;
      }

      shell.placing = reward.placing;
      shell.kudosToGive = reward.availableKudos;
      shell.xpRound = reward.matchXP;
      shell.kudoReceived = reward.receivedKudos;
    }

    this.checkAcheievements();

    if (needSave) {
      this.dispatchEvent(new Relay(Relay.GOTO, "SaveGame"));
    }

    for (let i = 0; i < this.players.length; i++) {
      this.multiplayer.lobby?.updateBar(i);
    }

    switch (this.room.phase) {
      case "Lobby":
        if (this.locate != "Lobby") {
          if (this.multiplayer.game && !this.multiplayer.game.levelEnd) {
            this.multiplayer.game.endMPGame();
          }
          break;
        }

        for (const pos of this.room.positions) {
          const shell = this.playerMap.get(pos[0]);
          if (!shell) {
            continue;
          }
          shell.time = pos[6];
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
          for (const player of this.players) {
            player.time = 0;
          }
          this.positionVersions.clear();

          SoundBox.playSound("Boop2");
          this.dispatchEvent(new Relay(Relay.GOTO, "Lobby", "StartGame"));
          break;
        } else if (this.multiplayer.game.levelNum !== this.room.nextLevel) {
          if (this.multiplayer.game && !this.multiplayer.game.levelEnd) {
            this.multiplayer.game.endMPGame();
          }
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

        for (const [id, v, x, y, fr, sx, t] of this.room.positions) {
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

          shell.time = t;
          if (shell.time > 0 && !shell.completedLevel) {
            this.multiplayer.game?.iAmDone(shell);
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

        if (this.multiplayer.game.endCountdown) {
          this.multiplayer.game.endCountdown.timer = this.room.timer;
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

  public giveKudo(player: PlayerShell) {
    const targetId = this.room.players.find((p) => p.localId === player.id)?.id;
    if (!targetId) {
      return;
    }
    this.dispatchEvent(
      new ExternalEvent({
        type: "give-kudo",
        targetId,
      })
    );
  }

  public isPlayerMuted(player: PlayerShell): boolean {
    return false;
  }

  public unMutePlayer(player: PlayerShell) {}

  public mutePlayer(player: PlayerShell) {}

  private checkAcheievements() {
    const shell = this.players.find((shell) => shell.isPlayer);

    if (this.player.wins >= 1) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 24));
    }
    if (this.player.wins >= 10) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 25));
    }
    if (this.player.wins >= 100) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 26));
    }

    if (this.player.kudos >= 10) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 27));
    }
    if (this.player.kudos >= 100) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 28));
    }
    if (this.player.kudos >= 250) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 29));
    }

    if (this.player.matches >= 5) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 30));
    }
    if (this.player.matches >= 25) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 31));
    }
    if (this.player.matches >= 100) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 32));
    }
    if (this.player.matches >= 250) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 33));
    }

    const reward = this.room.rewards.find((r) => r.id === shell.id);
    if (reward?.receivedKudos >= 5) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 34));
    }
    if (reward?.receivedKudos >= 7) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 35));
    }

    const level = this.multiplayer.getLevelByXP(this.player.xp);
    if (level >= 3) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 36));
    }
    if (level >= 5) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 37));
    }
    if (level >= 8) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 38));
    }
    if (level >= 10) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 39));
    }
    if (level >= 15) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 40));
    }
    if (level >= 20) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 41));
    }
    if (level >= 25) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 42));
    }
    if (level >= 30) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 43));
    }
    if (level >= 35) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 44));
    }
    if (level >= 38) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 45));
    }
    if (level >= 39) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 46));
    }
    if (level >= 40) {
      this.dispatchEvent(new AchEvent(AchEvent.SEND, 47));
    }
  }
}
