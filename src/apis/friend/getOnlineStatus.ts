import { useUserStore } from '@/stores/user'
import { request } from '../base'

export class GetOnlineStatusReq {
    usernames!: string[]
}

export class GetOnlineStatusRes {
    result!: string
    uid!: string
    last_time!: number
    ext!: string
    status!: string
}

export const getOnlineStatus = request<GetOnlineStatusReq, GetOnlineStatusRes>({
    oprateUrl: () => {
        const userStore = useUserStore()

        return `users/${userStore.userId}/presence`
    },
    method: 'POST',
    headers: {
        'Authorization': true,
        'Content-Type': 'application/json',
    },
})
