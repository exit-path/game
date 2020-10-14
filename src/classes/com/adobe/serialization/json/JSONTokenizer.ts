import { JSONToken } from "./JSONToken";
import { JSONTokenType } from "./JSONTokenType";
import { JSONParseError } from "./JSONParseError";

export class JSONTokenizer {
  private declare ch: string;

  private declare jsonString: string;

  private declare loc: number;

  private declare obj: any;

  public constructor(s: string) {
    this.jsonString = s;
    this.loc = 0;
    this.nextChar();
  }

  public getNextToken(): JSONToken {
    var _loc2_: any = null;
    var _loc3_: any = null;
    var _loc4_: any = null;
    var token: JSONToken = new JSONToken();
    this.skipIgnored();
    switch (this.ch) {
      case "{":
        token.type = JSONTokenType.LEFT_BRACE;
        token.value = "{";
        this.nextChar();
        break;
      case "}":
        token.type = JSONTokenType.RIGHT_BRACE;
        token.value = "}";
        this.nextChar();
        break;
      case "[":
        token.type = JSONTokenType.LEFT_BRACKET;
        token.value = "[";
        this.nextChar();
        break;
      case "]":
        token.type = JSONTokenType.RIGHT_BRACKET;
        token.value = "]";
        this.nextChar();
        break;
      case ",":
        token.type = JSONTokenType.COMMA;
        token.value = ",";
        this.nextChar();
        break;
      case ":":
        token.type = JSONTokenType.COLON;
        token.value = ":";
        this.nextChar();
        break;
      case "t":
        _loc2_ = "t" + this.nextChar() + this.nextChar() + this.nextChar();
        if (_loc2_ == "true") {
          token.type = JSONTokenType.TRUE;
          token.value = true;
          this.nextChar();
        } else {
          this.parseError("Expecting 'true' but found " + _loc2_);
        }
        break;
      case "f":
        _loc3_ =
          "f" +
          this.nextChar() +
          this.nextChar() +
          this.nextChar() +
          this.nextChar();
        if (_loc3_ == "false") {
          token.type = JSONTokenType.FALSE;
          token.value = false;
          this.nextChar();
        } else {
          this.parseError("Expecting 'false' but found " + _loc3_);
        }
        break;
      case "n":
        _loc4_ = "n" + this.nextChar() + this.nextChar() + this.nextChar();
        if (_loc4_ == "null") {
          token.type = JSONTokenType.NULL;
          token.value = null;
          this.nextChar();
        } else {
          this.parseError("Expecting 'null' but found " + _loc4_);
        }
        break;
      case '"':
        token = this.readString();
        break;
      default:
        if (this.isDigit(this.ch) || this.ch == "-") {
          token = this.readNumber();
          break;
        }
        if (this.ch == "") {
          return null;
        }
        this.parseError("Unexpected " + this.ch + " encountered");
        break;
    }
    return token;
  }

  private isDigit(ch: string): boolean {
    return ch >= "0" && ch <= "9";
  }

  private isHexDigit(ch: string): boolean {
    var uc: string = ch.toUpperCase();
    return this.isDigit(ch) || (uc >= "A" && uc <= "F");
  }

  private isWhiteSpace(ch: string): boolean {
    return ch == " " || ch == "\t" || ch == "\n";
  }

  private nextChar(): string {
    return (this.ch = this.jsonString.charAt(this.loc++));
  }

  public parseError(message: string): void {
    throw new JSONParseError(message, this.loc, this.jsonString);
  }

  private readNumber(): JSONToken {
    var token: JSONToken = new JSONToken();
    token.type = JSONTokenType.NUMBER;
    var input: any = "";
    if (this.ch == "-") {
      input = input + "-";
      this.nextChar();
    }
    if (!this.isDigit(this.ch)) {
      this.parseError("Expecting a digit");
    }
    if (this.ch == "0") {
      input = input + this.ch;
      this.nextChar();
      if (this.isDigit(this.ch)) {
        this.parseError("A digit cannot immediately follow 0");
      }
    } else {
      while (this.isDigit(this.ch)) {
        input = input + this.ch;
        this.nextChar();
      }
    }
    if (this.ch == ".") {
      input = input + ".";
      this.nextChar();
      if (!this.isDigit(this.ch)) {
        this.parseError("Expecting a digit");
      }
      while (this.isDigit(this.ch)) {
        input = input + this.ch;
        this.nextChar();
      }
    }
    if (this.ch == "e" || this.ch == "E") {
      input = input + "e";
      this.nextChar();
      if (this.ch == "+" || this.ch == "-") {
        input = input + this.ch;
        this.nextChar();
      }
      if (!this.isDigit(this.ch)) {
        this.parseError("Scientific notation number needs exponent value");
      }
      while (this.isDigit(this.ch)) {
        input = input + this.ch;
        this.nextChar();
      }
    }
    var num: number = Number(input);
    if (this.isFinite(num) && !isNaN(num)) {
      token.value = num;
      return token;
    }
    this.parseError("Number " + num + " is not valid!");
    return null;
  }

  private readString(): JSONToken {
    var _loc3_: any = null;
    var i: number = 0;
    var token: JSONToken = new JSONToken();
    token.type = JSONTokenType.STRING;
    var string: any = "";
    this.nextChar();
    while (this.ch != '"' && this.ch != "") {
      if (this.ch == "\\") {
        this.nextChar();
        switch (this.ch) {
          case '"':
            string = string + '"';
            break;
          case "/":
            string = string + "/";
            break;
          case "\\":
            string = string + "\\";
            break;
          case "b":
            string = string + "\b";
            break;
          case "f":
            string = string + "\f";
            break;
          case "n":
            string = string + "\n";
            break;
          case "r":
            string = string + "\r";
            break;
          case "t":
            string = string + "\t";
            break;
          case "u":
            _loc3_ = "";
            for (i = 0; i < 4; i++) {
              if (!this.isHexDigit(this.nextChar())) {
                this.parseError(" Excepted a hex digit, but found: " + this.ch);
              }
              _loc3_ = _loc3_ + this.ch;
            }
            string = string + String.fromCharCode(parseInt(_loc3_, 16));
            break;
          default:
            string = string + ("\\" + this.ch);
        }
      } else {
        string = string + this.ch;
      }
      this.nextChar();
    }
    if (this.ch == "") {
      this.parseError("Unterminated string literal");
    }
    this.nextChar();
    token.value = string;
    return token;
  }

  private skipComments(): void {
    if (this.ch == "/") {
      this.nextChar();
      switch (this.ch) {
        case "/":
          do {
            this.nextChar();
          } while (this.ch != "\n" && this.ch != "");
          this.nextChar();
          break;
        case "*":
          this.nextChar();
          while (true) {
            if (this.ch == "*") {
              this.nextChar();
              if (this.ch == "/") {
                break;
              }
            } else {
              this.nextChar();
            }
            if (this.ch == "") {
              this.parseError("Multi-line comment not closed");
            }
          }
          this.nextChar();
          break;
        default:
          this.parseError(
            "Unexpected " + this.ch + " encountered (expecting '/' or '*' )"
          );
      }
    }
  }

  private skipIgnored(): void {
    this.skipWhite();
    this.skipComments();
    this.skipWhite();
  }

  private skipWhite(): void {
    while (this.isWhiteSpace(this.ch)) {
      this.nextChar();
    }
  }
}
