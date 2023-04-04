import { useUserStore } from '@/stores/user'
import { request } from '../base'

export class RemoveBlackListRes {
    entities!: RemoveUserInfo[]
}

export class RemoveUserInfo {
    uuid!: string
    type!: string
    created!: string
    modified!: number
    username!: string
    activated!: string
    nickname!: string
}

export const removeBlackList = (id: string) =>
    request<null, RemoveBlackListRes>({
        oprateUrl() {
            return `users/${useUserStore().userId}/blocks/users/${id} `
        },
        method: 'DELETE',
        headers: {
            Authorization: true,
        },
    })
