import { User } from "./User";

export class Room {
  private declare game: boolean;

  private declare id: number;

  private declare limbo: boolean;

  private declare maxSpectators: number;

  private declare maxUsers: number;

  private declare myPlayerIndex: number;

  private declare name: string;

  private declare priv: boolean;

  private declare specCount: number;

  private declare temp: boolean;

  private declare userCount: number;

  private declare userList: any[];

  private declare variables: any[];

  public constructor(
    id: number,
    name: string,
    maxUsers: number,
    maxSpectators: number,
    isTemp: boolean,
    isGame: boolean,
    isPrivate: boolean,
    isLimbo: boolean,
    userCount: number = 0,
    specCount: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.maxSpectators = maxSpectators;
    this.maxUsers = maxUsers;
    this.temp = isTemp;
    this.game = isGame;
    this.priv = isPrivate;
    this.limbo = isLimbo;
    this.userCount = userCount;
    this.specCount = specCount;
    this.userList = [];
    this.variables = [];
  }

  public addUser(u: User, id: number): void {
    this.userList[id] = u;
    if (this.game && u.isSpectator()) {
      this.specCount++;
    } else {
      this.userCount++;
    }
  }

  public clearUserList(): void {
    this.userList = [];
    this.userCount = 0;
    this.specCount = 0;
  }

  public clearVariables(): void {
    this.variables = [];
  }

  public getId(): number {
    return this.id;
  }

  public getMaxSpectators(): number {
    return this.maxSpectators;
  }

  public getMaxUsers(): number {
    return this.maxUsers;
  }

  public getMyPlayerIndex(): number {
    return this.myPlayerIndex;
  }

  public getName(): string {
    return this.name;
  }

  public getSpectatorCount(): number {
    return this.specCount;
  }

  public getUser(userId: any): User {
    var i: any = null;
    var u: any = null;
    var user: any = null;
    if (typeof userId == "number") {
      user = this.userList[userId];
    } else if (typeof userId == "string") {
      for (i in this.userList) {
        u = this.userList[i];
        if (u.getName() == userId) {
          user = u;
          break;
        }
      }
    }
    return user;
  }

  public getUserCount(): number {
    return this.userCount;
  }

  public getUserList(): any[] {
    return this.userList;
  }

  public getVariable(varName: string): any {
    return this.variables[varName];
  }

  public getVariables(): any[] {
    return this.variables;
  }

  public isGame(): boolean {
    return this.game;
  }

  public isLimbo(): boolean {
    return this.limbo;
  }

  public isPrivate(): boolean {
    return this.priv;
  }

  public isTemp(): boolean {
    return this.temp;
  }

  public removeUser(id: number): void {
    var u: User = this.userList[id];
    if (this.game && u.isSpectator()) {
      this.specCount--;
    } else {
      this.userCount--;
    }
    delete this.userList[id];
  }

  public setIsLimbo(b: boolean): void {
    this.limbo = b;
  }

  public setMyPlayerIndex(id: number): void {
    this.myPlayerIndex = id;
  }

  public setSpectatorCount(n: number): void {
    this.specCount = n;
  }

  public setUserCount(n: number): void {
    this.userCount = n;
  }

  public setUserList(uList: any[]): void {
    this.userList = uList;
  }

  public setVariables(vars: any[]): void {
    this.variables = vars;
  }
}
