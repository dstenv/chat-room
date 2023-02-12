import { useAdminStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { request, type RequestBaseType } from '@/apis/base'

export class UserInfo {
    username!: string
    password!: string
    nickname!: string
}

export interface RegisterBody extends RequestBaseType {
    data: UserInfo
}

export class RegisterResult {}

export const registerUser = async (info: UserInfo) => {
    const adminStore = useAdminStore()
    const { token } = storeToRefs(adminStore)
    try {
        await request<RegisterBody, RegisterResult>({
            method: 'POST',
            url: 'users',
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            data: info,
        })
        return true
    } catch (error) {
        return false
    }
}
