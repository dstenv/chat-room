import { useUserStore } from '@/stores/user'
import { request } from '../base'

export class AddBlackReq {
    usernames!: string[]
}

export class AddBlackRes {
    data!: string[]
}

export const addBlack = request<AddBlackReq, AddBlackRes>({
    oprateUrl() {
        return `users/${useUserStore().userId}/blocks/users `
    },
    method: 'POST',
    headers: {
        Authorization: true,
    },
})
