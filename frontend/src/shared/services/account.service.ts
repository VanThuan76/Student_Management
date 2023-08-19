import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IAccount } from '../typeDef/auth.type';


class AccountService {
    getAllAccount(): Promise<AxiosResponse<IAccount[]>> {
        return httpsNoToken.get('/account')
    }
    getAccountById(id: number): Promise<AxiosResponse<IAccount>> {
        return httpsNoToken.get(`/account/${id}`)
    }
    newAccount(body: { username: string, password: string }) {
        return httpsNoToken.post("/account", body)
    }
    updateAccount(id: number, body: { username: string, password: string }) {
        return httpsNoToken.put(`/account/${id}`, body)
    }
    deleteAccount(id: number) {
        return httpsNoToken.delete(`/account/${id}`)
    }
}

export const accountService = new AccountService()
