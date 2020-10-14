import { JSONDecoder } from "./JSONDecoder";
import { JSONEncoder } from "./JSONEncoder";

export class JSON {
  public constructor() {}

  public static decode(s: string): any {
    var decoder: JSONDecoder = new JSONDecoder(s);
    return decoder.getValue();
  }

  public static encode(o: any): string {
    var encoder: JSONEncoder = new JSONEncoder(o);
    return encoder.getString();
  }
}
