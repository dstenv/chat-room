import { request } from '../base'
import type { UserProPertyType } from '@/types'

export class GetUserInfoRes {
    data!: UserProPertyType
    duration!: number
    timestamp!: number
}

export const getUserInfo = (userId: string) =>
    request<null, GetUserInfoRes>({
        url: `metadata/user/${userId}`,
        headers: {
            Authorization: true,
        },
    })
