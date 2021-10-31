import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { autorun, makeAutoObservable, reaction } from "mobx";
import { PlayerData } from "../models/data";
import {
  JoinRoomMessage,
  MessageMessage,
  UpdatePlayersMessage,
  UpdateStateMessage,
} from "../models/messages";
import {
  applyGameStateDiff,
  applyLobbyStateDiff,
  ChatMessage,
  Room,
  RoomGameState,
  RoomLobbyState,
} from "../models/multiplayer";
import type { RootStore } from "./root";

export class MultiplayerStore {
  readonly conn: HubConnection;

  room: Room | null = null;

  readonly messages: ChatMessage[] = [];

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
    this.conn.on("Message", this.onMessage);

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

    reaction(
      () =>
        this.room && this.room.id !== "lobby"
          ? (this.room.state as RoomGameState).phase
          : null,
      (phase, prev) => {
        if (prev === "Lobby" && phase === "InGame") {
          this.messages.length = 0;
        }
      },
      { name: "clearMessages" }
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
        version: 1,
      }),
      credentials: "include",
    });
    if (resp.status !== 200) {
      let message: string | null = null;
      try {
        const { error } = await resp.json();
        message = error ?? null;
      } catch {}

      if (message) {
        throw new Error(`Access to server is denied: ${message}`);
      }
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
      main.multiplayer.tubes.init(
        this.room.state as RoomGameState,
        this.conn.connectionId!
      );
      main.multiplayer.quickPlayLobby.step = 4;
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

  private onMessage = (msg: MessageMessage) => {
    this.messages.push({
      sender: msg.sender,
      senderColor: msg.senderColor,
      text: msg.text,
      textColor: msg.textColor,
    });
  };

  public logMessage(text: string, color = 0xffffff) {
    this.messages.push({
      sender: "@SYSTEM",
      senderColor: color,
      text: text,
      textColor: color,
    });
  }

  public async createRoom(name: string) {
    return await this.conn.invoke<{ error?: string }>("CreateGameRoom", name);
  }

  public async joinRoom(roomId: string, asSpectator: boolean) {
    return await this.conn.invoke<{ error?: string }>(
      "JoinRoom",
      roomId,
      asSpectator
    );
  }

  public async reportPosition(
    v: number,
    x: number,
    y: number,
    fr: number,
    sx: number,
    t: number
  ) {
    return await this.conn.send("ReportPosition", v, x, y, fr, sx, t);
  }

  public async reportCheckpoint(id: number) {
    return await this.conn.send("ReportCheckpoint", id);
  }

  public async giveKudo(targetId: string) {
    return await this.conn.send("GiveKudo", targetId);
  }

  public async sendMessage(text: string) {
    if (!this.conn.connectionId) {
      return;
    }
    return await this.conn.invoke("SendMessage", text);
  }

  public async setNextLevel(level: string) {
    return await this.conn.invoke("SetNextLevel", level);
  }
}
