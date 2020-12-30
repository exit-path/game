import { RemotePlayer } from "./multiplayer";

export interface JoinRoomMessage {
  id: string;
  name: string;
  players: RemotePlayer[];
}

export interface UpdatePlayersMessage {
  joined: RemotePlayer[];
  exited: string[];
}
