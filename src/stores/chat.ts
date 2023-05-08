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

export const useChatStore = defineStore(
    'chat',
    () => {
        const chatData = {
            userId: '',
            targetId: '',
            startId: '',
            chatType: 'singleChat' as ChatType,
            searchDirection: 'up' as 'up' | 'down',
            msgSize: 20,
        }

        const socketDefer = {
            connected: null as Defer<void> | null,
            reconnected: null as Defer<void> | null,
            send: null as Defer<void> | null,
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
            // sdk登录环信IM
            EaseChatClient.open({
                user: chatData.userId.toLowerCase(),
                accessToken: userStore.token,
            })
                .then(() => {
                    console.log('登录环信IM成功')

                    socketDefer.connected!.resolve()
                })
                .catch((err) => {
                    socketDefer.connected!.reject()
                    console.log(socketDefer.connected, '登录环信IM失败', err)
                })
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
                loading: true,
                error: false,
                longTouch: false,
                from: userStore.userId,
                chatType: chatData.chatType,
                to: chatData.targetId,
                ext: {
                    avatar: Tools.getDefaultAvatar(
                        userStore.userInfo?.sex === '2',
                        userStore.userInfo?.avatar
                    ),
                    name: userStore.userInfo?.nickname || userStore.userId,
                },
            }

            console.log('本机展示的message -->', message)

            addMessage(message, true, false, push)

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
                return result
            } catch (error) {
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
                socketDefer.send.reject()
                return null
            }
        }

        const getHistoryMsg = async () => {
            console.log(socketDefer.connected)
            if (socketDefer.connected) {
                await socketDefer.connected.promise
            } else if (!EaseChatClient.isOpened()) {
                await connect()
            }

            try {
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

                const list = await EaseChatClient.getHistoryMessages({
                    targetId: chatData.targetId,
                    pageSize: chatData.msgSize,
                    chatType: chatData.chatType,
                    searchDirection: chatData.searchDirection,
                    /** 获取消息的起始位置 */
                    cursor: chatData.startId,
                })
                chatData.startId = list.cursor?.split('').includes('undefined')
                    ? messageList.value[0].id
                    : (list.cursor as string)

                const messages: MessageData[] = list.messages.map((item) => ({
                    ...item,
                    loading: false,
                    error: false,
                    longTouch: false,
                }))

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
                insertBefore(messages.reverse())
                console.log('messageList', messageList.value)
            } catch (error) {}
        }

        const addMessage = (
            msg: MessageData,
            loading = true,
            error = false,
            push = true
        ) => {
            if (messageList.value.map((msg) => msg.id).includes(msg.id)) return

            if (push) {
                messageList.value.push({
                    ...msg,
                    loading,
                    error,
                    longTouch: false,
                })
            } else {
                messageList.value.unshift({
                    ...msg,
                    loading,
                    error,
                    longTouch: false,
                })
            }
            // console.log(messageList, 'messageList')
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
            if (chatType !== chatData.chatType) {
                chatData.startId = ''
            }

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
        }
    },
    {
        persist: {
            enabled: true,
        },
    }
)
