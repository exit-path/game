import { Level, LevelFlags, LevelObject, LevelObjectType } from "./level";
import { inflateRaw } from "pako";
import { Reader } from "./reader";

const pattern = /^(.+)~#-([a-zA-Z0-9+/]+=*)~$/;

export function isV1(data: string): boolean {
  return pattern.test(data);
}

const typeMap: Record<number, LevelObjectType> = {
  2: "start-point",
  1: "end-point",
  3: "tile",
  7: "half-tile",
  4: "invisible-tile",
  12: "bouncer",
  6: "spikes",
  5: 'pop-spikes',
  13: "fall-spikes",
  14: "laser-cannon",
  9: "swinging-axe",
  8: "grinder",
  16: "checkpoint",
  15: "teleporter",
  11: "left-treadmill",
  10: "right-treadmill",
  17: 'text',
  18: 'trigger'
}

const typesWithText = new Set<LevelObjectType>([
  "pop-spikes",
  "grinder",
  "swinging-axe",
  "bouncer",
  "teleporter",
  "trigger",
  "text",
]);

export function parseV1(data: string): Level {
  const [, name, encodedBin] = pattern.exec(data)!;
  const compressedBin = atob(encodedBin);
  const bin = new DataView(inflateRaw(compressedBin).buffer);
  const reader = new Reader(bin);

  const sig = reader.readInt32();
  if (sig != 0x564C5045) {
    const sigHex = sig.toString(16).padStart(8, '0');
    throw new Error(`Invalid level signature: ${sigHex}`);
  }
  const version = reader.readByte();
  if (version !== 1) {
    throw new Error(`Invalid level version: ${version}`);
  }

  reader.offset += 2;
  const flags: LevelFlags = reader.readByte();
  if (flags & LevelFlags.IsProtected) {
    reader.offset += 16;
  }

  const numMatrix = reader.readInt32();
  const matrixes: Array<[number, number, number, number, number, number]> = [];
  matrixes.push([1, 0, 0, 1, 0, 0]);
  for (let i = 0; i < numMatrix; i++) {
    matrixes.push([
      reader.readFloat(),
      reader.readFloat(),
      reader.readFloat(),
      reader.readFloat(),
      0, 0,
    ])
  }

  const numObjects = reader.readInt32();
  const objects: LevelObject[] = [];
  for (let i = 0; i < numObjects; i++) {
    const binType = reader.readByte();
    const type = typeMap[binType & 0x7f];
    if (!type) {
      throw new Error(`Unknown level object type: ${binType}`);
    }

    let text: string | undefined;
    let name = "";
    if (typesWithText.has(type)) {
      const s = reader.readByteLengthString();
      if (type === "text") {
        text = s;
      } else {
        name = s;
      }
    }

    let matrix: [number, number, number, number, number, number];
    if (binType & 0x80) {
      matrix = [...matrixes[reader.readInt32()]];
    } else {
      matrix = [...matrixes[0]];
    }

    matrix[4] = reader.readFloat();
    matrix[5] = reader.readFloat();

    objects.push({ type, name, matrix, text });
  }

  return { name, objects, flags };
}
