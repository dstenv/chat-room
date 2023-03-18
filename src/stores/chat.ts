import { EaseChatClient } from '@/utils/config'
import { Defer } from '@/utils/defer'
import { defineStore } from 'pinia'
import { showToast } from 'vant'
import { useUserStore } from './user'
import type { AllMsgType, MessageData, SendMsgType } from '@/types/message'
import { Hook } from '@/utils/hooks'

export const useChatStore = defineStore('chat', () => {
    const socketDefer = {
        connected: null as Defer<void> | null,
        reconnected: null as Defer<void> | null,
    }

    const socketHook = {
        message: new Hook<(item: number) => string>(),
        reconnect: new Hook(),
    }

    const messageList = reactive<MessageData[]>([])

    const connect = async () => {
        if (!socketDefer.connected) {
            socketDefer.connected = new Defer()
        } else if (socketDefer.connected) {
            await socketDefer.connected.promise
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
            showToast('正在重新连接')
            // 重新连接
            socketDefer.connected.reject()
        }
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

    const sendMessage = async <T extends SendMsgType>(
        type: T,
        data: AllMsgType[T]
    ) => {}

    return {
        socketDefer,
        connect,
    }
})
