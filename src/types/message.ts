import type { EasemobChat } from 'easemob-websdk'

/** 会话类型：单聊、群聊和聊天室分别为 singleChat groupChat 和 chatRoom */
export type chatType = 'singleChat' | 'groupChat' | 'chatRoom'

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

/** 消息类型 */
export type MessageData = (
    | EasemobChat.TextMsgBody
    | EasemobChat.ImgMsgBody
    | EasemobChat.AudioMsgBody
    | EasemobChat.VideoMsgBody
    | EasemobChat.FileMsgBody
    | EasemobChat.LocationMsgBody
    | EasemobChat.CustomMsgBody
    | EasemobChat.ReceivedMsgBody
    | EasemobChat.DeliveryMsgBody
    | EasemobChat.ReadMsgBody
    | EasemobChat.RecallMsgBody
    | EasemobChat.ChannelMsgBody
) & {
    keyId?: number
    loading: boolean
    error: boolean
}

/** 发送消息的基础配置 */
export interface SendMsgBaseOption {
    chatType: chatType
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

/** 所有消息的配置 */
export interface AllMsgType {
    txt: SendTextOption
    img: SendImgOption
    audio: any
    loc: any
    video: any
    file: any
    custom: any
    cmd: any
    inform: any
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
    cmd: any
    inform: any
}
