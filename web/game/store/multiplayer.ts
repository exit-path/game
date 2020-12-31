import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { autorun, makeAutoObservable } from "mobx";
import { PlayerData } from "../models/data";
import {
  JoinRoomMessage,
  UpdatePlayersMessage,
  UpdateStateMessage,
} from "../models/messages";
import {
  applyGameStateDiff,
  applyLobbyStateDiff,
  Room,
  RoomGameState,
  RoomLobbyState,
} from "../models/multiplayer";
import type { RootStore } from "./root";

export class MultiplayerStore {
  readonly conn: HubConnection;

  room: Room | null = null;

  constructor(readonly root: RootStore, readonly address: string) {
    makeAutoObservable(this);

    const url = new URL("api/multiplayer/hub", address);
    this.conn = new HubConnectionBuilder()
      .withUrl(url.toString(), { accessTokenFactory: this.requestAccessToken })
      .configureLogging(LogLevel.Information)
      .build();

    this.conn.on("JoinRoom", this.onJoinRoom);
    this.conn.on("UpdatePlayers", this.onUpdatePlayers);
    this.conn.on("UpdateState", this.onUpdateState);

    autorun(
      () => {
        if (!this.root.game.stage) {
          return;
        }
        const handler = this.root.game.stage.__withContext((err: unknown) => {
          if (err) {
            this.root.game.main?.multiplayer?.tubes.onConnectionLost();
          }
        });
        this.conn.onclose(handler);
      },
      { name: "connectionLost" }
    );
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
      state: msg.state,
    };

    if (this.room.id === "lobby") {
      this.root.modal.present({ type: "room-selection" });
    } else {
      const main = this.root.game.main!;
      main.multiplayer.quickPlayLobby.step = 4;
      main.multiplayer.tubes.player = main.playerObj;
    }
  };

  private onUpdatePlayers = (msg: UpdatePlayersMessage) => {
    if (!this.room) {
      return;
    }

    const players = this.room.players.filter((p) => !msg.exited.includes(p.id));
    players.push(...msg.joined);
    this.room.players = players;
  };

  private onUpdateState = (msg: UpdateStateMessage) => {
    if (!this.room) {
      return;
    }

    if (this.room.id === "lobby") {
      applyLobbyStateDiff(this.room.state as RoomLobbyState, msg.diff as any);
    } else {
      applyGameStateDiff(this.room.state as RoomGameState, msg.diff as any);
    }
  };

  public async createRoom(name: string) {
    return await this.conn.invoke<{ error?: string }>("CreateGameRoom", name);
  }

  public async joinRoom(roomId: string) {
    return await this.conn.invoke<{ error?: string }>("JoinRoom", roomId);
  }
}
