import { useUserStore } from '@/stores/user'
import { request } from '../base'

export class GetBlackListRes {
    data!: string[]
    count!: number
}

export const getBlackList = request<null, GetBlackListRes>({
    oprateUrl: () => {
        return `users/${useUserStore().userId}/blocks/users`
    },
    headers: {
        Authorization: true,
    },
})
