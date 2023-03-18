<script setup lang="ts">
import {
    EaseChatClient,
    EaseChatSDK,
    baseConfig,
    chatRoomBaseConfig,
} from '@/utils/config'
import { useAdminStore, useUserStore } from '@/stores/user'
import { getAdminToken } from '@/apis/getAdminToken'

interface AdminStorage {
    application: string
    time: number
    token: string
}

const router = useRouter()

const transitionName = ref('fade-in')

const toList: string[] = ['/main/pages/chat']

const fromList: string[] = []

const initAdmin = async () => {
    const adminStore = useAdminStore()
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
        const result = await getAdminToken({
            grant_type: 'client_credentials',
            client_id: chatRoomBaseConfig.clientID,
            client_secret: chatRoomBaseConfig.clientSecret,
            ttl: 0,
        })

        adminStore.setToken(result.access_token)
        adminStore.setApplication(result.application)
        adminStore.setTime(result.expires_in)
        localStorage.setItem(
            'adminToken',
            JSON.stringify({
                application: result.application,
                time: result.expires_in,
                token: result.access_token,
            })
        )
        return
    }
    const adminInfo: AdminStorage = JSON.parse(adminToken)
    adminStore.setToken(adminInfo.token)
    adminStore.setApplication(adminInfo.application)
    adminStore.setTime(adminInfo.time)
}

const initUser = () => {
    const userStore = useUserStore()
    const userToken = localStorage.getItem('userToken')
    if (!userToken) {
        router.replace('/begin')
        return
    }
    const userId = localStorage.getItem('userId')
    userStore.setToken(userToken)
    userStore.setUserID(userId || '')
}

initAdmin()
initUser()

EaseChatSDK.logger.disableAll()
// connect监听
EaseChatClient.addEventHandler('connection', {
    onConnected: () => {
        console.log('>>>>>环信连接成功')
    },
    onDisconnected: () => {
        console.log('------>webscoket断开连接')
        // showToast('网络错误，请重新登录')
        // localStorage.removeItem('userToken')
        // localStorage.removeItem('userId')
        // router.push('/begin')
    },
    // 本机网络连接成功。
    onOnline: () => {
        console.log('本机网络连接成功。')
    },
    // 本机网络掉线。
    onOffline: () => {
        console.log('本机网络掉线。')
    },
    onError: (error) => {
        console.log('on error', error)
    },
})

// message 相关监听
EaseChatClient.addEventHandler('messageListen', {
    // 收到文本消息。
    onTextMessage: (message) => {
        console.log('>>>>>>>App mesage', message, message.type)
    },

    // 收到表情消息。报错（暂时不知原因）
    // onEmojiMessage: () => {},

    // 收到图片消息。
    onImageMessage: (message) => {
        console.log('收到图片消息。', message)
    },
    // 收到命令消息。
    onCmdMessage: (message) => {
        console.log('>>>>>收到命令消息', message)
    },
    // 收到音频消息。
    onAudioMessage: () => {
        console.log('收到音频消息。')
    },
    // 收到位置消息。
    onLocationMessage: () => {
        console.log('收到位置消息。')
    },
    // 收到文件消息。
    onFileMessage: () => {
        console.log('收到文件消息。')
    },
    // 收到自定义消息。
    onCustomMessage: () => {
        console.log('收到自定义消息。')
    },
    // 收到视频消息。
    onVideoMessage: () => {
        console.log('收到视频消息。')
    },
    // 收到消息撤回回执。
    onRecallMessage: () => {
        console.log('收到消息撤回回执。')
    },
})

router.beforeEach((to, from) => {
    if (
        from.path === '/my-chat' &&
        [
            '/main/pages/chat',
            '/main/pages/mail-list',
            '/main/pages/wechat-moments',
            '/main/pages/my',
        ].includes(to.path)
    ) {
        transitionName.value = 'fade-out'
        return
    }
    transitionName.value = 'fade-in'
})
</script>

<template>
    <router-view v-slot="{ Component }">
        <transition :name="transitionName">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style lang="scss" scoped>
.fade-in-enter-from {
    transform: translate(100vw);
}

.fade-in-enter-active {
    transition: all 0.3s linear;
}

.fade-in-enter-to {
    transform: translate(0);
}

.fade-in-leave-from {
    opacity: 1;
}

.fade-in-leave-active {
    transition: all 0.2s linear;
}

.fade-in-leave-to {
    opacity: 0.1;
}

.fade-out-enter-from {
    opacity: 0.1;
}

.fade-out-enter-active {
    transition: all 0.3s linear;
}

.fade-out-enter-to {
    opacity: 1;
}

.fade-out-leave-from {
    transform: translate(0);
    opacity: 1;
}

.fade-out-leave-active {
    transition: all 0.3s linear;
}

.fade-out-leave-to {
    transform: translate(100vw);
    opacity: 0;
}
</style>
