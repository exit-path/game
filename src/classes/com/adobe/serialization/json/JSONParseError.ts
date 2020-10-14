export class JSONParseError extends Error {
  private declare _location: number;

  private declare _text: string;

  public constructor(
    message: string = "",
    location: number = 0,
    text: string = ""
  ) {
    super(message);
    this._location = location;
    this._text = text;
  }

  public get location(): number {
    return this._location;
  }

  public get text(): string {
    return this._text;
  }
}
