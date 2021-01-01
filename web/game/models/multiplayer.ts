import { PlayerData } from "./data";

export interface RemotePlayer {
  id: string;
  name: string;
  color: number;
}

export interface RemoteRoom {
  id: string;
  name: string;
  numPlayers: number;
  phase: "Lobby" | "InGame";
}

export interface ChatMessage {
  sender: string;
  senderColor: number;
  text: string;
  textColor: number;
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

export interface GamePlayer {
  id: string;
  localId: number;
  data: PlayerData;
}

export type GamePlayerPosition = [
  id: number,
  v: number,
  x: number,
  y: number,
  fr: number,
  sx: number,
  t: number
];

export type GamePlayerCheckpoints = [id: number, ...checkpoints: number[]];

export interface GamePlayerReward {
  id: number;
  placing: number;
  matchXP: number;
  availableKudos: number;
  receivedKudos: number;
}

export interface RoomGameState {
  players: GamePlayer[];
  phase: "Lobby" | "InGame";
  timer: number;
  nextLevel: number;
  nextLevelName: string;
  positions: GamePlayerPosition[];
  checkpoints: GamePlayerCheckpoints[];
  rewards: GamePlayerReward[];
}

interface RoomGameStateDiff {
  removed?: number[];
  updated?: GamePlayer[];
  phase?: "Lobby" | "InGame";
  timer?: number;
  nextLevel?: number;
  nextLevelName?: string;
  positions?: GamePlayerPosition[];
  checkpoints?: GamePlayerCheckpoints[];
  rewards?: GamePlayerReward[];
}

export function applyGameStateDiff(
  state: RoomGameState,
  diff: RoomGameStateDiff
) {
  const players = new Map(state.players.map((p) => [p.localId, p]));
  for (const id of diff.removed ?? []) {
    players.delete(id);
  }
  for (const player of diff.updated ?? []) {
    players.set(player.localId, player);
  }
  state.players = Array.from(players.values()).sort(
    (a, b) => a.localId - b.localId
  );

  if (diff.phase != null) {
    state.phase = diff.phase;
  }
  if (diff.timer != null) {
    state.timer = diff.timer;
  }
  if (diff.nextLevel != null) {
    state.nextLevel = diff.nextLevel;
  }
  if (diff.nextLevelName != null) {
    state.nextLevelName = diff.nextLevelName;
  }
  if (diff.positions != null) {
    if (diff.positions.length === 0) {
      state.positions = [];
    } else {
      const positions = new Map(state.positions.map((p) => [p[0], p]));
      for (const p of diff.positions) {
        positions.set(p[0], p);
      }
      state.positions = Array.from(positions.values());
    }
  }
  if (diff.checkpoints != null) {
    if (diff.checkpoints.length === 0) {
      state.checkpoints = [];
    } else {
      const checkpoints = new Map(state.checkpoints.map((p) => [p[0], p]));
      for (const p of diff.checkpoints) {
        checkpoints.set(p[0], p);
      }
      state.checkpoints = Array.from(checkpoints.values());
    }
  }
  if (diff.rewards != null) {
    if (diff.rewards.length === 0) {
      state.rewards = [];
    } else {
      const rewards = new Map(state.rewards.map((r) => [r.id, r]));
      for (const r of diff.rewards) {
        rewards.set(r.id, r);
      }
      state.rewards = Array.from(rewards.values());
    }
  }
}
