import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";
import { PlayerData } from "../models/data";
import { JoinRoomMessage, UpdatePlayersMessage } from "../models/messages";
import { Room } from "../models/multiplayer";
import type { RootStore } from "./root";

export class MultiplayerStore {
  readonly conn: HubConnection;

  room: Room | null = null;

  constructor(
    readonly root: RootStore,
    readonly address: string,
    readonly roomId = "lobby"
  ) {
    makeAutoObservable(this);

    const url = new URL("api/multiplayer/hub", address);
    this.conn = new HubConnectionBuilder()
      .withUrl(url.toString(), { accessTokenFactory: this.requestAccessToken })
      .configureLogging(LogLevel.Information)
      .build();

    this.conn.on("JoinRoom", this.onJoinRoom);
    this.conn.on("UpdatePlayers", this.onUpdatePlayers);
  }

  private requestAccessToken = async () => {
    const player: PlayerData = {
      displayName: this.root.game.instance.playerObj.userName,
      primaryColor: this.root.game.instance.playerObj.colour,
      secondaryColor: this.root.game.instance.playerObj.colour2,
      headType: this.root.game.instance.playerObj.headType,
      handType: this.root.game.instance.playerObj.handType,
      xp: this.root.game.instance.playerObj.xp,
      kudos: this.root.game.instance.playerObj.kudos,
      matches: this.root.game.instance.playerObj.matches,
      wins: this.root.game.instance.playerObj.wins,
    };

    const url = new URL("api/multiplayer/auth", this.address);
    const resp = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player,
        roomId: this.roomId,
      }),
      credentials: "include",
    });
    if (resp.status !== 200) {
      throw new Error("Access to server is denied");
    }
    const { token } = await resp.json();
    return token;
  };

  public async connect() {
    await this.conn.start();
  }

  public disconnect() {
    this.conn.stop().catch((err) => console.error(err));
  }

  private onJoinRoom = (msg: JoinRoomMessage) => {
    this.room = {
      id: msg.id,
      name: msg.name,
      players: msg.players,
    };
  };

  private onUpdatePlayers = (msg: UpdatePlayersMessage) => {
    if (!this.room) {
      return;
    }

    const players = this.room.players.filter((p) => !msg.exited.includes(p.id));
    players.push(...msg.joined);
    this.room.players = players;
  };
}
