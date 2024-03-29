import { EaseChatClient, EaseChatSDK } from '@/utils/config'
import { Defer } from '@/utils/defer'
import { defineStore } from 'pinia'
import { showToast } from 'vant'
import { useUserStore } from './user'
import type {
    AllMsgType,
    AllRecieveMsg,
    MessageData,
    SendMsgType,
    ChatType,
} from '@/types/message'
import { Hook } from '@/utils/hooks'
import type { EasemobChat } from 'easemob-websdk'
import type { GroupInfo } from '@/types'
import { Tools } from '@/utils/tools'

export const messageShowType: Partial<Record<SendMsgType, string>> = {
    img: '[图片]',
}

export const sendError: Record<string, any> = {
    blocked: '您已被拉黑',
}

export const useChatStore = defineStore(
    'chat',
    () => {
        const chatData = reactive({
            userId: '',
            targetId: '',
            startId: '',
            chatType: 'singleChat' as ChatType,
            searchDirection: 'up' as 'up' | 'down',
            msgSize: 20,
        })

        const socketDefer = {
            connected: null as Defer<void> | null,
            reconnected: null as Defer<void> | null,
            send: null as Defer<void> | null,
            getHistory: null as Defer<void> | null,
        }

        const socketHook = {
            message: new Hook<() => void>(),
            reconnect: new Hook(),
        }

        const MSG_SIZE = 20

        const userStore = useUserStore()

        const messageList = ref<MessageData[]>([])

        const allHistory = ref(false)

        const connect = async () => {
            console.log('try connect', socketDefer.connected)

            if (socketDefer.connected) {
                await socketDefer.connected.promise

                return socketDefer.connected.promise
            } else if (!socketDefer.connected) {
                socketDefer.connected = new Defer()
                console.log(
                    '创建新的socket连接defer --> ',
                    socketDefer.connected
                )
            }
            const userStore = useUserStore()

            console.log(
                'try 登录环信IM -->',
                chatData.userId,
                userStore.token,
                EaseChatClient,
                EaseChatClient.isOpened()
            )
            // sdk登录环信IM
            // EaseChatClient.open({
            //     user: chatData.userId.toLowerCase(),
            //     accessToken: userStore.token,
            // })
            //     .then(() => {
            //         console.log('登录环信IM成功')

            //         socketDefer.connected!.resolve()
            //     })
            //     .catch((err) => {
            //         socketDefer.connected!.reject()
            //         console.log(socketDefer.connected, '登录环信IM失败', err)
            //     })

            try {
                await EaseChatClient.open({
                    user: chatData.userId.toLowerCase(),
                    accessToken: userStore.token,
                    success(res) {
                        console.log('res -->', res)
                    },
                })
                console.log('登录环信IM成功')

                socketDefer.connected!.resolve()
            } catch (error) {
                socketDefer.connected!.reject()
                console.log(socketDefer.connected, '登录环信IM失败', error)
            }
            return socketDefer.connected!.promise
        }

        const reconnect = async (max = 5) => {
            if (max === 0) {
                showToast('连接失败')
                socketDefer.reconnected!.reject()
                socketDefer.reconnected = null
                return
            }
            if (!socketDefer.reconnected) {
                socketDefer.reconnected = new Defer()
            }

            // 重新连接

            if (!socketDefer.connected) {
                console.log('重新连接', max)
                connect()
                    .then(() => {
                        socketHook.reconnect.trigger()
                        socketDefer.reconnected!.resolve()
                        socketDefer.reconnected = null
                    })
                    .catch(() => {
                        setTimeout(() => {
                            reconnect(max - 1)
                        }, 1000)
                    })
            } else {
                socketDefer.reconnected!.reject()
                socketDefer.reconnected = null
            }
        }

        /**
         * @description 展示消息和发送消息分离
         * @return {*}
         */
        const sendMessage = async <T extends SendMsgType>(
            type: T,
            data: AllMsgType[T] & { type?: SendMsgType },
            /** 视图层展示的消息 */
            tempData: AllRecieveMsg[T],
            /** 自定义操作函数 */
            opreate: (msg: MessageData) => void,
            push = true
        ): Promise<EasemobChat.SendMsgResult | null> => {
            console.log('socketDefer.send -->', socketDefer.send)
            if (socketDefer.send) {
                await socketDefer.send.promise
            } else if (!socketDefer.send) {
                socketDefer.send = new Defer()
            }

            data = {
                ...data,
                type,
                chatType: chatData.chatType,
                to: chatData.targetId,
                ext: {
                    ...data.ext,
                    avatar: Tools.getDefaultAvatar(
                        userStore.userInfo?.sex === '2',
                        userStore.userInfo?.avatar
                    ),
                    name: userStore.userInfo?.nickname || userStore.userId,
                },
            }

            const message: MessageData = {
                ...tempData,
                keyId: +new Date(),
                id: `${+new Date()}`,
                loading: true,
                error: false,
                longTouch: false,
                from: userStore.userId,
                chatType: chatData.chatType,
                to: chatData.targetId,
                ext: {
                    ...tempData.ext,
                    avatar: Tools.getDefaultAvatar(
                        userStore.userInfo?.sex === '2',
                        userStore.userInfo?.avatar
                    ),
                    name: userStore.userInfo?.nickname || userStore.userId,
                },
            }

            console.log('本机展示的message -->', message)

            addMessage(message, true, false, push)

            console.log('messageList -->', messageList.value)

            opreate && opreate(message)

            /** 使用IM生成消息 */
            const msg = EaseChatSDK.message.create(data)

            console.log(msg, '发送的msg')
            try {
                const result = await EaseChatClient.send(msg)

                for (let i = messageList.value.length - 1; i >= 0; i--) {
                    if (message.keyId === messageList.value[i].keyId) {
                        /** 存储服务器消息id，获取聊天记录返回的是服务器消息id不是localid */
                        messageList.value[i] = {
                            ...message,
                            loading: false,
                            id: result.serverMsgId,
                        }
                        // db.addSource('message', { ...messageList[i] })
                        break
                    }
                }

                console.log('发送的result', result)
                socketDefer.send.resolve()
                socketDefer.send = null
                return result
            } catch (error: any) {
                console.log('sendMsg error -->', error)

                showToast(`${sendError[error.message as string]}`)
                for (let i = messageList.value.length - 1; i >= 0; i--) {
                    if (message.keyId === messageList.value[i].keyId) {
                        messageList.value[i] = {
                            ...message,
                            loading: false,
                            error: true,
                        }
                        // db.addSource('message', messageList[i])
                        break
                    }
                }
                socketDefer.send!.reject()
                socketDefer.send = null
                return null
            }
        }

        const getHistoryMsg = async (splice = true, push = false) => {
            console.log(socketDefer.connected, 'socketDefer.connected')
            if (socketDefer.connected) {
                await socketDefer.connected.promise
            } else if (!EaseChatClient.isOpened()) {
                await connect()
            }

            if (socketDefer.getHistory) {
                await socketDefer.getHistory.promise
            } else if (!socketDefer.getHistory) {
                socketDefer.getHistory = new Defer()
            }

            try {
                if (splice) {
                    messageList.value.splice(0, messageList.value.length)
                }
                console.log('try getHistoryMsg')
                // const list = await db.findSourceByTable('message')

                console.log('请求历史消息的请求体', {
                    targetId: chatData.targetId,
                    pageSize: chatData.msgSize,
                    chatType: chatData.chatType,
                    searchDirection: chatData.searchDirection,
                    /** 获取消息的起始位置 */
                    cursor: chatData.startId,
                })

                // if (
                //     Number(chatData.startId) <
                //     Number(messageList.value[0].id || '')
                // ) {
                //     console.log(
                //         'chatData.startId -->',
                //         chatData.startId,
                //         messageList.value[0].id
                //     )
                //     return
                // }

                const list = await EaseChatClient.getHistoryMessages({
                    targetId: chatData.targetId,
                    pageSize: chatData.msgSize,
                    chatType: chatData.chatType,
                    searchDirection: chatData.searchDirection,
                    /** 获取消息的起始位置 */
                    cursor: chatData.startId,
                })
                console.log('list -->', list)

                if (!list.cursor || list.cursor === 'undefined') {
                    chatData.startId = messageList.value[0]?.id ?? ''
                } else {
                    chatData.startId = list.cursor as string
                }

                const messages: MessageData[] = list.messages.map((item) => ({
                    ...item,
                    loading: false,
                    error: false,
                    longTouch: false,
                }))
                console.log(
                    'list.messages.length -->',
                    list.messages.length,
                    chatData.startId
                )
                if (list.messages.length > 0) {
                    if (list.messages.length < MSG_SIZE) {
                        chatData.startId = ''
                        allHistory.value = true
                    }

                    console.log(
                        `有历史消息${list.messages.length}条`,
                        chatData.startId
                    )
                } else {
                    console.log('历史消息为空')
                    if (list.cursor === 'undefined') {
                        allHistory.value = true
                    }
                }

                if (!push) {
                    insertBefore(messages)
                } else {
                    messageList.value = [...messageList.value, ...messages]
                    deleteManyMsg()
                }
                socketDefer.getHistory.resolve()
                socketDefer.getHistory = null
                console.log('messageList', messageList.value)
            } catch (error) {
                socketDefer.getHistory!.reject()
                socketDefer.getHistory = null
                console.log('error -->', error)
            }
        }

        const addMessage = (
            msg: MessageData,
            loading = true,
            error = false,
            push = true
        ) => {
            if (messageList.value.map((msg) => msg.id).includes(msg.id)) return

            if (push) {
                console.log('addMessage push -->', {
                    ...msg,
                    loading,
                    error,
                    longTouch: false,
                })
                messageList.value.push({
                    ...msg,
                    loading,
                    error,
                    longTouch: false,
                })
            } else {
                console.log('addMessage push -->', {
                    ...msg,
                    loading,
                    error,
                    longTouch: false,
                })
                messageList.value.unshift({
                    ...msg,
                    loading,
                    error,
                    longTouch: false,
                })
            }
            console.log(messageList, 'messageList')
        }

        const setUserId = (id: string) => {
            chatData.userId = id
        }

        const setchatData = (
            id: string,
            chatType: ChatType,
            searchType: 'up' | 'down' = 'up',
            msgSize = 20
        ) => {
            chatData.startId = ''

            chatData.targetId = id
            chatData.chatType = chatType
            chatData.searchDirection = searchType
            chatData.msgSize = msgSize

            console.log('setchatData', { ...chatData })
        }

        const insertBefore = (msgList: MessageData[]) => {
            messageList.value.splice(0, 0, ...msgList)
            deleteManyMsg()
        }

        /** 去除重复的消息 */
        const deleteManyMsg = () => {
            const newList: MessageData[] = []

            for (let i = 0; i < messageList.value.length; i++) {
                if (
                    !newList.find((item) => item.id === messageList.value[i].id)
                ) {
                    newList.push({ ...messageList.value[i] })
                }
            }

            messageList.value = newList.map((item) => ({ ...item }))
        }

        /** 清除操作 */
        const clean = () => {
            // socketDefer.connected = null

            socketDefer.reconnected = null

            chatData.startId = ''
            chatData.targetId = ''

            messageList.value = []
        }

        const clear = () => {
            socketDefer.connected = null
            socketDefer.reconnected = null
            socketDefer.send = null
            socketDefer.getHistory = null

            chatData.startId = ''
            chatData.targetId = ''

            messageList.value = []
        }

        return {
            socketDefer,
            messageList,
            chatData,
            allHistory,
            connect,
            sendMessage,
            addMessage,
            setUserId,
            setchatData,
            getHistoryMsg,
            clean,
            clear,
        }
    },
    {
        persist: {
            enabled: true,
        },
    }
)
