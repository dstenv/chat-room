import type { EasemobChat } from 'easemob-websdk'

/** 用户属性 */
export class UserProPertyType {
    sex = '1'
    nickname?: string
    userid?: string
    avatar?: string
}

/** 消息类型 */
export interface MessageData {
    data: any
}
