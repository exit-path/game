import { Keyboard } from "@kiootic/swf-lib/dist/classes/flash/ui";
import { Keybindings, main } from "../global";
import lib from "swf-lib";

type KeyCode = "down" | "left" | "right" | "up" | "flow";

export class Key {
  private static initialized = false;
  public static keysDown = new Set<number>();
  public static keybindings: Keybindings;

  public static DOWN: KeyCode = "down";
  public static LEFT: KeyCode = "left";
  public static RIGHT: KeyCode = "right";
  public static UP: KeyCode = "up";
  public static FLOW: KeyCode = "flow";

  public constructor() {}

  public static initialize(stage: lib.flash.display.Stage): any {
    Key.keybindings = main().keybindings;

    stage.addEventListener(
      lib.flash.events.KeyboardEvent.KEY_DOWN,
      (e: lib.flash.events.KeyboardEvent) => Key.keysDown.add(e.keyCode)
    );
    stage.addEventListener(
      lib.flash.events.KeyboardEvent.KEY_UP,
      (e: lib.flash.events.KeyboardEvent) => Key.keysDown.delete(e.keyCode)
    );
    stage.addEventListener(lib.flash.events.Event.DEACTIVATE, () =>
      Key.keysDown.clear()
    );
    Key.initialized = true;
  }

  public static isDown(keyCode: KeyCode | number): boolean {
    if (!Key.initialized) {
      throw new Error("Key class has yet been initialized.");
    }

    if (typeof keyCode === "number") {
      return Key.keysDown.has(keyCode);
    }

    let keys: string[];
    switch (keyCode) {
      case "left":
        keys = [Key.keybindings.left1, Key.keybindings.left2];
        break;
      case "right":
        keys = [Key.keybindings.right1, Key.keybindings.right2];
        break;
      case "up":
        keys = [Key.keybindings.up1, Key.keybindings.up2];
        break;
      case "down":
        keys = [Key.keybindings.down1, Key.keybindings.down2];
        break;
      case "flow":
        keys = [
          Key.keybindings.flow1,
          Key.keybindings.flow2,
          Key.keybindings.flow3,
        ];
        break;
    }

    return keys.some((k) => Key.keysDown.has(Keyboard.codeMap[k]));
  }

  public static isInitialized(): any {
    return Key.initialized;
  }
}
