export interface RemotePlayer {
  id: string;
  name: string;
  color: number;
}

export interface RemoteRoom {
  id: string;
  name: string;
  numPlayers: number;
}

export interface Room<T = unknown> {
  id: string;
  name: string;
  players: RemotePlayer[];
  state: T;
}

export interface RoomLobbyState {
  rooms: RemoteRoom[];
}
