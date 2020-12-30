export interface RemotePlayer {
  id: string;
  name: string;
  color: number;
}

export interface Room<T = unknown> {
  id: string;
  name: string;
  players: RemotePlayer[];
  state: T;
}
