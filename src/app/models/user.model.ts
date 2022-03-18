export interface AuthData {
  accessToken: string;
    id:number;
    username: string;
    email: string;
    roles:string[]
}

export class User {
  constructor(
    public id:number,
    public username:string,
    public email: string,
    public roles:string[],
    private _token: string,
    private _tokenEx: Date
  ) {}

  get token() {
    if (!this._tokenEx || new Date() > this._tokenEx) {
      return null;
    }
    return this._token;
  }
}

export interface Users {
  content: User[];
}

