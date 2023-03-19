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
} from '@/types/message'
import { Hook } from '@/utils/hooks'
import { db } from '@/utils/indexDB'

export const useChatStore = defineStore('chat', () => {
    const socketDefer = {
        connected: null as Defer<void> | null,
        reconnected: null as Defer<void> | null,
    }

    const socketHook = {
        message: new Hook<() => void>(),
        reconnect: new Hook(),
    }

    const userStore = useUserStore()

    const messageList = reactive<MessageData[]>([])

    const connect = async () => {
        if (!socketDefer.connected) {
            socketDefer.connected = new Defer()
        } else if (socketDefer.connected) {
            await socketDefer.connected.promise
            return socketDefer.connected.promise
        }

        const userStore = useUserStore()

        try {
            // sdk登录环信IM
            await EaseChatClient.open({
                user: userStore.userId.toLowerCase(),
                accessToken: userStore.token,
            })

            socketDefer.connected.resolve()
        } catch (error) {
            // 重新连接
            socketDefer.connected.reject()
        }
        return socketDefer.connected.promise
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
        tempData: AllRecieveMsg[T]
    ) => {
        data = {
            ...data,
            type,
        }

        const message: MessageData = {
            ...tempData,
            keyId: +new Date(),
            loading: true,
            error: false,
            from: userStore.userId,
        }

        addMessage(message)
        // db.addSource('message', message)

        /** 使用IM生成消息 */
        const msg = EaseChatSDK.message.create(data)
        try {
            const result = await EaseChatClient.send(msg)

            for (let i = messageList.length - 1; i >= 0; i--) {
                if (message.keyId === messageList[i].keyId) {
                    messageList[i].loading = false
                    db.addSource('message', { ...messageList[i] })
                    break
                }
            }
            return result
        } catch (error) {
            for (let i = messageList.length - 1; i >= 0; i--) {
                if (message.keyId === messageList[i].keyId) {
                    messageList[i].loading = false
                    messageList[i].error = true
                    db.addSource('message', messageList[i])
                    break
                }
            }
            return null
        }
    }

    const addMessage = (msg: MessageData) => {
        messageList.push(msg)
    }

    return {
        socketDefer,
        messageList,
        connect,
        sendMessage,
        addMessage,
    }
})
