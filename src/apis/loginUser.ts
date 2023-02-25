import { request } from '@/apis/base'

export class LoginBody {
    grant_type?: 'password' | 'inherit' = 'password'
    username!: string
    password!: string
    ttl?: number = 0
}

export class LoginResult {
    access_token!: string
    expires_in!: number
    user!: LoginUserInfo
}

export interface LoginUserInfo {
    uuid: string
    type: string
    created: number
    modified: number
    username: string
    activated: boolean
}

export const loginUser = request<LoginBody, LoginResult>({
    method: 'POST',
    url: 'token',
})
