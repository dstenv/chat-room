import type { EasemobChat } from 'easemob-websdk'

/** 会话类型：单聊、群聊和聊天室分别为 singleChat groupChat 和 chatRoom */
export type ChatType = 'singleChat' | 'groupChat' | 'chatRoom'

/**
 * 用户消息在线状态
 * 0: 离线消息
 * 1: 在线消息
 * 2: 未知状态
 * 3: 未启用消息在线状态
 */
export type userMsgOnline = 0 | 1 | 2 | 3

/** 发送消息的类型 */
export type SendMsgType =
    | 'txt' // 文本
    | 'img' // 图片消息
    | 'audio' // 音频消息
    | 'loc' //
    | 'video' // 视频消息
    | 'file' // 文件消息
    | 'custom' //
    | 'cmd' //
    | 'inform' // 自定义
    | 'read'
    | 'delivery'
    | 'channel'

/** 消息类型 */
export type MessageData = EasemobChat.MessageBody & {
    keyId?: number
    loading?: boolean
    error?: boolean
    url?: string
    longTouch?: boolean
    ext?: Record<string, any>
}

/** 发送消息的基础配置 */
export interface SendMsgBaseOption {
    chatType: ChatType
    to: string
}

/** 发送文本消息的配置 */
export interface SendTextOption extends SendMsgBaseOption {
    msg: string
    ext?: string
}
/** 发送图片消息的配置 */
export interface SendImgOption extends SendMsgBaseOption {
    file: File
}
export interface SendVideoOption extends SendMsgBaseOption {
    file: File
}

/** 所有消息的配置 */
export interface AllMsgType {
    txt: SendTextOption
    img: SendImgOption
    audio: any
    loc: any
    video: SendVideoOption
    file: any
    custom: any
    cmd: any
    inform: any
    read: any
    delivery: any
    channel: any
}
/** 接收消息的类型配置 */
export interface AllRecieveMsg {
    txt: EasemobChat.TextMsgBody
    img: EasemobChat.ImgMsgBody
    audio: EasemobChat.AudioMsgBody
    video: EasemobChat.VideoMsgBody
    file: EasemobChat.FileMsgBody
    loc: EasemobChat.LocationMsgBody
    custom: EasemobChat.CustomMsgBody
    read: EasemobChat.ReadMsgBody
    delivery: EasemobChat.DeliveryMsgBody
    channel: EasemobChat.ChannelMsgBody
    cmd: any
    inform: any
}
