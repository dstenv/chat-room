import EaseChatSDK from 'easemob-websdk'

/**
 * @description 环信基础配置 demo应用
 */
const baseConfig = {
    RestApi: 'a1.easemob.com',
    orgName: '1125221214163135',
    socket3: 'im-api-v2.easemob.com',
    clientID: 'YXA62VO4Vj7CT-2ppwCbK0N8xw',
    clientSecret: 'YXA64_7wQq1yKt0I1bVn33rU0GubJJw',

    appName: 'demo',
    appKey: '1125221214163135#demo',
}

/**
 * chat-room应用
 */
const chatRoomBaseConfig = {
    RestApi: 'a1.easemob.com',
    orgName: '1125221214163135',
    socket3: 'im-api-v2.easemob.com',
    clientID: 'YXA6jTNKOWuMQe6twEQOd5lSTA',
    clientSecret: 'YXA6qT8Hl2XNh1W4v-iLILPKnrl-R4E',

    appName: 'chat-room',
    appKey: '1125221214163135#chat-room',
}

const baseUrl = `${window.location.protocol}//${baseConfig.RestApi}/`

const { appKey } = baseConfig
// const { appKey } = chatRoomBaseConfig

/*
 * isHttpDNS： isPrivate为true开启私有化配置则走自有配置的url以及apiUrl，
 * 否则为true就SDK自助获取DNS地址。
 * 【特别注意】如果不需要私有化配置，也就是自己定义url以及apiUrl。isHttpDNS、url、apiUrl，均可不用填写只用填入appKey！SDK内部会进行自动获取！
 **/
const EaseChatClient = new EaseChatSDK.connection({
    appKey,
    isHttpDNS: true,
    url: `//${baseConfig.socket3}`,
    apiUrl: `//${baseConfig.RestApi}`,
})
console.log('EaseIMClient', EaseChatClient)

/** 发送视频和图片等文件的大小 */
const FileLimit = {
    imgSize: 10,
    videoSize: 10,
}

export {
    EaseChatSDK,
    EaseChatClient,
    baseConfig,
    baseUrl,
    chatRoomBaseConfig,
    FileLimit,
}
