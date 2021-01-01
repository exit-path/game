import { RemotePlayer } from "./multiplayer";

export interface JoinRoomMessage {
  id: string;
  name: string;
  players: RemotePlayer[];
  state: unknown;
}

export interface UpdatePlayersMessage {
  joined: RemotePlayer[];
  exited: string[];
}

export interface UpdateStateMessage {
  diff: unknown;
}

export interface MessageMessage {
  sender: string;
  text: string;
  senderColor: number;
  textColor: number;
}
