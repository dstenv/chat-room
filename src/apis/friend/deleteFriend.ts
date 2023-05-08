import { useUserStore } from '@/stores/user'
import { request } from '../base'
import type { RemoveBlackListRes } from './removeBlackList'

export const deleteOneFriend = (id: string) =>
    request<null, RemoveBlackListRes>({
        oprateUrl() {
            return `users/${useUserStore().userId}/contacts/users/${id} `
        },
        method: 'DELETE',
        headers: {
            Authorization: true,
        },
    })
