import { Level } from "./level";
import { isV0, parseV0 } from "./parse-v0";
import { isV1, parseV1 } from "./parse-v1";

export function parse(data: string): Level {
  if (isV0(data)) {
    return parseV0(data);
  } else if (isV1(data)) {
    return parseV1(data);
  }
  throw new Error("Invalid level code");
}
