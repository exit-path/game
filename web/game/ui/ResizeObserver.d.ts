interface Window {
  ResizeObserver: typeof ResizeObserver;
}

interface ResizeObserverOptions {
  box?: "content-box" | "border-box" | "device-pixel-content-box";
}

interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

interface ResizeObserver {
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare var ResizeObserver: {
  new (callback: ResizeObserverCallback): ResizeObserver;
  prototype: ResizeObserver;
};

interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}
