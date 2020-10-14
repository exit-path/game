import { JSONToken } from "./JSONToken";
import { JSONTokenizer } from "./JSONTokenizer";
import { JSONTokenType } from "./JSONTokenType";

export class JSONDecoder {
  private declare token: JSONToken;

  private declare tokenizer: JSONTokenizer;

  private declare value: any;

  public constructor(s: string) {
    this.tokenizer = new JSONTokenizer(s);
    this.nextToken();
    this.value = this.parseValue();
  }

  public getValue(): any {
    return this.value;
  }

  private nextToken(): JSONToken {
    return (this.token = this.tokenizer.getNextToken());
  }

  private parseArray(): any[] {
    var a: any[] = new Array<any>();
    this.nextToken();
    if (this.token.type == JSONTokenType.RIGHT_BRACKET) {
      return a;
    }
    while (true) {
      a.push(this.parseValue());
      this.nextToken();
      if (this.token.type == JSONTokenType.RIGHT_BRACKET) {
        break;
      }
      if (this.token.type == JSONTokenType.COMMA) {
        this.nextToken();
      } else {
        this.tokenizer.parseError(
          "Expecting ] or , but found " + this.token.value
        );
      }
    }
    return a;
  }

  private parseObject(): any {
    var key: any = null;
    var o: any = new Object();
    this.nextToken();
    if (this.token.type == JSONTokenType.RIGHT_BRACE) {
      return o;
    }
    while (true) {
      if (this.token.type == JSONTokenType.STRING) {
        key = String(this.token.value);
        this.nextToken();
        if (this.token.type == JSONTokenType.COLON) {
          this.nextToken();
          o[key] = this.parseValue();
          this.nextToken();
          if (this.token.type == JSONTokenType.RIGHT_BRACE) {
            break;
          }
          if (this.token.type == JSONTokenType.COMMA) {
            this.nextToken();
          } else {
            this.tokenizer.parseError(
              "Expecting } or , but found " + this.token.value
            );
          }
        } else {
          this.tokenizer.parseError(
            "Expecting : but found " + this.token.value
          );
        }
      } else {
        this.tokenizer.parseError(
          "Expecting string but found " + this.token.value
        );
      }
    }
    return o;
  }

  private parseValue(): any {
    switch (this.token.type) {
      case JSONTokenType.LEFT_BRACE:
        return this.parseObject();
      case JSONTokenType.LEFT_BRACKET:
        return this.parseArray();
      case JSONTokenType.STRING:
      case JSONTokenType.NUMBER:
      case JSONTokenType.TRUE:
      case JSONTokenType.FALSE:
      case JSONTokenType.NULL:
        return this.token.value;
      default:
        this.tokenizer.parseError("Unexpected " + this.token.value);
        return null;
    }
  }
}
