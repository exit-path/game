import lib from "swf-lib";

export class Key {
  public static A: number = 65;

  public static allLetters: any[] = new Array<any>(
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  );

  public static ARROWKEYS: string = "arrowKeys";

  public static D: number = 68;

  public static DOWN: string = "down";

  public static DOWNKEY: number = lib.flash.ui.Keyboard.DOWN;

  private static dualKey: boolean = false;

  public static EIGHT: number = 56;

  public static FIVE: number = 53;

  public static FOUR: number = 52;

  private static initialized: boolean = false;

  private static keysDown: any = new Object();

  public static LEFT: string = "left";

  public static LEFTKEY: number = lib.flash.ui.Keyboard.LEFT;

  public static M: number = 77;

  public static NINE: number = 57;

  public static ONE: number = 49;

  public static P: number = 80;

  public static Q: number = 81;

  public static RIGHT: string = "right";

  public static RIGHTKEY: number = lib.flash.ui.Keyboard.RIGHT;

  public static S: number = 83;

  public static SEVEN: number = 55;

  public static SIX: number = 54;

  public static THREE: number = 51;

  public static TWO: number = 50;

  public static UP: string = "up";

  public static UPKEY: number = lib.flash.ui.Keyboard.UP;

  public static W: number = 87;

  public static WASD: string = "wasd";

  public static ZERO: number = 48;

  public constructor() {}

  private static clearKeys(event: lib.flash.events.Event): void {
    Key.keysDown = new Object();
  }

  public static initialize(stage: lib.flash.display.Stage, dual: boolean): any {
    Key.dualKey = dual;
    if (!Key.initialized) {
      stage.addEventListener(
        lib.flash.events.KeyboardEvent.KEY_DOWN,
        Key.keyPressed
      );
      stage.addEventListener(
        lib.flash.events.KeyboardEvent.KEY_UP,
        Key.keyReleased
      );
      stage.addEventListener(lib.flash.events.Event.DEACTIVATE, Key.clearKeys);
      Key.initialized = true;
    }
  }

  public static isDown(keyCode: any): boolean {
    if (!Key.initialized) {
      throw new Error("Key class has yet been initialized.");
    }
    if (typeof keyCode == "number") {
      return Boolean(keyCode in Key.keysDown);
    }
    if (Key.dualKey) {
      if (keyCode == Key.LEFT) {
        return (
          Boolean(Key.A in Key.keysDown) || Boolean(Key.LEFTKEY in Key.keysDown)
        );
      }
      if (keyCode == Key.RIGHT) {
        return (
          Boolean(Key.D in Key.keysDown) ||
          Boolean(Key.RIGHTKEY in Key.keysDown)
        );
      }
      if (keyCode == Key.UP) {
        return (
          Boolean(Key.W in Key.keysDown) || Boolean(Key.UPKEY in Key.keysDown)
        );
      }
      if (keyCode == Key.DOWN) {
        return (
          Boolean(Key.S in Key.keysDown) || Boolean(Key.DOWNKEY in Key.keysDown)
        );
      }
    }
    return false;
  }

  public static isInitialized(): any {
    return Key.initialized;
  }

  private static keyPressed(event: lib.flash.events.KeyboardEvent): void {
    Key.keysDown[event.keyCode] = true;
  }

  private static keyReleased(event: lib.flash.events.KeyboardEvent): void {
    if (event.keyCode in Key.keysDown) {
      delete Key.keysDown[event.keyCode];
    }
  }
}
