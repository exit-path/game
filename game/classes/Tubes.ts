import lib from "swf-lib";
import { PlayerShell } from "./PlayerShell";
import { Math2 } from "./john/Math2";
import { PlayerBar } from "./PlayerBar";
import { PlayerObject } from "./PlayerObject";

export class Tubes extends lib.flash.display.MovieClip {
  public locate = "QPL";

  public rankedPlayers: PlayerShell[] = [];

  public players: PlayerShell[] = [];

  public nextLevel = 100 + Math2.random(10);

  public player: PlayerObject;

  public constructor() {
    super();
  }

  public init(player: PlayerObject) {}

  public kill() {}

  public disconnect() {}

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
