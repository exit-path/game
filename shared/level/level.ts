export interface Level {
  name: string;
  flags: LevelFlags;
  objects: LevelObject[];
}

export enum LevelFlags {
  FlowNormal = 0,
  FlowDisabled = 1,
  FlowAlways = 2,
  FlowModeMask = 3,

  IsProtected = 4,
  AllowSuicide = 8,
  PauseUnaffectPlayer = 16,
  ShowTeleporterName = 32,
}

export interface LevelObject {
  type: LevelObjectType;
  name: string;
  matrix: readonly [number, number, number, number, number, number];
  text?: string;
}

export type LevelObjectType =
  | "start-point"
  | "end-point"
  | "tile"
  | "half-tile"
  | "invisible-tile"
  | "bouncer"
  | "spikes"
  | "pop-spikes"
  | "fall-spikes"
  | "laser-cannon"
  | "swinging-axe"
  | "grinder"
  | "checkpoint"
  | "teleporter"
  | "left-treadmill"
  | "right-treadmill"
  | "text"
  | "trigger";
