import { makeAutoObservable } from "mobx";

export interface FlashGame extends HTMLObjectElement {
  startSPGame(level: number): void;
  setMode(mode: string | null): void;
  setReplay(recording: number[]): void;
  stopReplay(): void;
}

export class SWFRecorder {
  private game: FlashGame | null = null;
  private _mode: "recording" | "replaying" | null = null;
  recording: number[] = [];
  replayPositions: [number, number][] = [];

  get mode() {
    return this._mode;
  }

  constructor() {
    makeAutoObservable(this);
  }

  setGame = (game: FlashGame | null) => {
    this.game = game;
    Object.assign(window, { swf: this });
  };

  startSPGame(level: number) {
    this.game?.startSPGame(level);
  }

  startRecord() {
    this.recording = [];
    this._mode = "recording";
    this.game?.setMode(this._mode);
  }

  stopRecord() {
    this._mode = null;
    this.game?.setMode(this._mode);
  }

  startReplay() {
    this.game?.setReplay(this.recording);
    this._mode = "replaying";
    this.game?.setMode(this._mode);
    this.replayPositions = [];
  }

  stopReplay() {
    this._mode = null;
    this.game?.stopReplay();
  }

  private onFrameKeys(keys: number) {
    this.recording.push(keys);
  }

  private onReplayFinished() {
    this._mode = null;
  }

  private onPlayerPosition(x: number, y: number) {
    this.replayPositions.push([x, y]);
  }
}
