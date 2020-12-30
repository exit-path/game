export interface RemotePlayer {
  id: string;
  name: string;
  color: number;
}

export interface Room {
  id: string;
  name: string;
  players: RemotePlayer[];
}
