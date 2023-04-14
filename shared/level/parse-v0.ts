import { Level, LevelObject, LevelObjectType } from "./level";
import { inflateRaw } from "pako";
import { Reader } from "./reader";

const pattern = /^(.+)#([a-zA-Z0-9+/]+=*)$/;

export function isV0(data: string): boolean {
  return pattern.test(data);
}

const typeMap: Record<string, LevelObjectType> = {
  "s": "start-point",
  "e": "end-point",
  "b": "tile",
  "h": "half-tile",
  " ": "invisible-tile",
  "x": "bouncer",
  "k": "spikes",
  "p": 'pop-spikes',
  "f": "fall-spikes",
  "l": "laser-cannon",
  "a": "swinging-axe",
  "g": "grinder",
  "c": "checkpoint",
  "t": "teleporter",
  "<": "left-treadmill",
  ">": "right-treadmill",
  "q": 'text',
  "r": 'trigger'
}

export function parseV0(data: string): Level {
  const [, name, encodedBin] = pattern.exec(data)!;
  const compressedBin = atob(encodedBin);
  const bin = new DataView(inflateRaw(compressedBin).buffer);
  const reader = new Reader(bin);

  const count = reader.readInt32();
  const objects: LevelObject[] = [];
  for (let i = 0; i < count; i++) {
    const binType = String.fromCodePoint(reader.readByte());
    const type = typeMap[binType];
    if (!type) {
      throw new Error(`Unknown level object type: ${JSON.stringify(binType)}`);
    }

    let text: string | undefined;
    if (type === "text") {
      text = reader.readByteLengthString();
    }

    const name = reader.readByteLengthString();
    const matrix = [
      reader.readFloat(),
      reader.readFloat(),
      reader.readFloat(),
      reader.readFloat(),
      reader.readFloat(),
      reader.readFloat(),
    ] as const;

    objects.push({ type, name, matrix, text });
  }

  return { name, objects, flags: 0 };
}
