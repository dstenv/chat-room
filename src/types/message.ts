/** 消息类型 */
export interface MessageData {
    data: any
}

/** 会话类型：单聊、群聊和聊天室分别为 singleChat groupChat 和 chatRoom */
export type chatType = 'singleChat' | 'groupChat' | 'chatRoom'

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

/** 发送消息的基础配置 */
export interface SendMsgBaseOption {
    chatType: chatType
    type: SendMsgType
    to: string
}

/** 发送文本消息的配置 */
export interface SendTextOption extends SendMsgBaseOption {
    msg: string
    ext: string
}
/** 发送图片消息的配置 */
export interface SendImgOption extends SendMsgBaseOption {
    file: File
}

/** 所有消息的类型 */
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
