export class User {
  private declare id: number;

  private declare isMod: boolean;

  private declare isSpec: boolean;

  private declare name: string;

  private declare pId: number;

  private declare variables: any[];

  public constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.variables = [];
    this.isSpec = false;
    this.isMod = false;
  }

  public clearVariables(): void {
    this.variables = [];
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPlayerId(): number {
    return this.pId;
  }

  public getVariable(varName: string): any {
    return this.variables[varName];
  }

  public getVariables(): any[] {
    return this.variables;
  }

  public isModerator(): boolean {
    return this.isMod;
  }

  public isSpectator(): boolean {
    return this.isSpec;
  }

  public setIsSpectator(b: boolean): void {
    this.isSpec = b;
  }

  public setModerator(b: boolean): void {
    this.isMod = b;
  }

  public setPlayerId(pid: number): void {
    this.pId = pid;
  }

  public setVariables(o: any): void {
    var key: any = null;
    var v: any = undefined;
    for (key in o) {
      v = o[key];
      if (v != null) {
        this.variables[key] = v;
      } else {
        delete this.variables[key];
      }
    }
  }
}
