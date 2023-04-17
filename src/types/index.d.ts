import type { EasemobChat } from 'easemob-websdk'

/** 用户属性 */
export class UserProPertyType {
    /** 1:男  2:女 */
    sex = '1'
    nickname?: string
    userid?: string
    avatar?: string
    area?: string
    onLine: boolean
}

export class NewFriend {
    avatar?: string
    from: string
    text: string
    read: boolean
    sex?: string
    nickname?: string
    agree: boolean
}

export interface BlackListItem {
    id: string
    nickname: string
    avatar: string
}

export interface GroupItem extends EasemobChat.BaseGroupInfo {
    groupimg: string
}

export interface GroupInfo {
    groupId: string
}
