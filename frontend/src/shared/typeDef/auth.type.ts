export interface IAuthResponse {
  message: string;
  account: IAccount;
}

export interface IAccount {
  id: number;
  username: string;
  password: string;
  active: number;
}
