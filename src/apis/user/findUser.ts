import { request } from '../base'

export class User {
    path!: string
    uri!: string
    timestamp!: number
    entities!: UserEntity[]
    count!: number
    action!: string
    duration!: number
}

export class UserEntity {
    created!: number
    nickname!: string
    modified!: number
    type!: string
    uuid!: string
    username!: string
    activated!: boolean
}

export const findUser = (userid: string) =>
    request<null, User>({
        url: `users/${userid}`,
        headers: {
            Authorization: true,
        },
    })
