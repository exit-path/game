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

interface RoomLobbyStateDiff {
  removed: string[];
  updated: RemoteRoom[];
}

export function applyLobbyStateDiff(
  state: RoomLobbyState,
  diff: RoomLobbyStateDiff
) {
  const rooms = new Map(state.rooms.map((r) => [r.id, r]));
  for (const id of diff.removed) {
    rooms.delete(id);
  }
  for (const room of diff.updated) {
    rooms.set(room.id, room);
  }
  state.rooms = Array.from(rooms.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
