import { request } from '../base'

export class AddFriendRes {
    entities!: AddFriendItem
}

export class AddFriendItem {
    uuid!: string
    type!: string
    created!: number
    modified!: number
    username!: string
    activated!: boolean
    nickname!: string
}

export const addFriend = (url: string) =>
    request<null, AddFriendRes>({
        method: 'POST',
        url,
    })
