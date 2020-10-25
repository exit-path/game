import { makeAutoObservable } from "mobx";
import lib from "swf-lib";
import { manifest } from "../../../game";

export class LibraryStore {
  private loadPromise: Promise<lib.__internal.AssetLibrary> | null = null;
  value: lib.__internal.AssetLibrary | null = null;
  loadProgress = 0;
  loadError = "";

  get isLoading() {
    return !!this.loadPromise;
  }

  constructor() {
    makeAutoObservable(this);
  }

  private reportProgress = (value: number) => {
    this.loadProgress = value;
  };

  private onLoadCompleted = (library: lib.__internal.AssetLibrary) => {
    this.loadPromise = null;
    this.loadProgress = 1;
    this.value = library;
  };

  private onLoadError = (error: unknown) => {
    this.loadPromise = null;
    this.loadError = String(error);
  };

  load() {
    if (this.isLoading || this.value) {
      return;
    }
    this.loadProgress = 0;
    this.loadError = "";
    this.loadPromise = lib.__internal.loadManifest(
      manifest,
      this.reportProgress
    );
    this.loadPromise.then(this.onLoadCompleted, this.onLoadError);
  }
}
