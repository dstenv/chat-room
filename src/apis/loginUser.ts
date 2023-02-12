import { request, type RequestBaseType } from '@/apis/base'

export class LoginBody {
    grant_type?: 'password' | 'inherit'
    username!: string
    password!: string
    ttl?: number
}

export interface LoginRequest extends RequestBaseType {
    data: LoginBody
}

export class LoginResult {
    data!: {
        access_token: string
        expires_in: number
        user: LoginUserInfo
    }
}

export interface LoginUserInfo {
    uuid: string
    type: string
    created: number
    modified: number
    username: string
    activated: boolean
}

export const loginUser = async ({
    grant_type = 'password',
    username,
    password,
    ttl = 0,
}: LoginBody) => {
    try {
        const result = await request<LoginRequest, LoginResult>({
            method: 'POST',
            url: 'token',
            data: {
                grant_type,
                username,
                password,
                ttl,
            },
        })
        return result.data
    } catch (error) {
        return
    }
}
