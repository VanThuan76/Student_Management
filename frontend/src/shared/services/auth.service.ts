import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IAccount } from '../typeDef/auth.type';
import { IResponse } from '../typeDef/response.typ';


class AuthService {
  authenticated(body: { username: string; password: string }): Promise<AxiosResponse<IResponse<IAccount>>> {
    return httpsNoToken.post('/login', body)
  }
  forgetPassword(body: {username: string, oldPassword: string, newPassword: string}) {
    return httpsNoToken.put('/forget-password', body)
  }
}

export const authService = new AuthService()
