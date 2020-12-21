import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";
import type { RootStore } from "./root";

export class MultiplayerStore {
  readonly conn: HubConnection;

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
  }

  private requestAccessToken = async () => {
    const url = new URL("api/multiplayer/auth", this.address);
    const resp = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player: { displayName: "test" },
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
}
