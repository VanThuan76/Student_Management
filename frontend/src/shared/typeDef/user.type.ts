export interface IUser {
  address?: string;
  created_at: string;
  email: string;
  id: number;
  is_activated: number;
  name?: string;
  password: string;
  phone: string;
  role: number;
  token?: string;
  updated_at?: string;
}