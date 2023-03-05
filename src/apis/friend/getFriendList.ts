import { request } from '../base'

export class GetFriendListRes {
    data!: string[]
    entities!: Object
    count!: number
}

export const getFriendList = (url: string) =>
    request<null, GetFriendListRes>({
        url,
        headers: {
            Authorization: true,
        },
    })
