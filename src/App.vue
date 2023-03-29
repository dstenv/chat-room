<script setup lang="ts">
import {
    EaseChatClient,
    EaseChatSDK,
    baseConfig,
    chatRoomBaseConfig,
} from '@/utils/config'
import { useAdminStore, useUserStore } from '@/stores/user'
import { getAdminToken } from '@/apis/getAdminToken'
import { useChatStore } from '@/stores/chat'
import { useChatListStore } from './stores/chatList'
// import { db } from './utils/indexDB'

interface AdminStorage {
    application: string
    time: number
    token: string
}

const chatStore = useChatStore()
const router = useRouter()
const chatListStore = useChatListStore()

const transitionName = ref('fade-in')

const toList: string[] = ['/chat', '/add-friend']
const fromList: string[] = ['/search-user']
/**
 * TODO 显示tabbar的路由
 */
const showTabbarList = [
    '/main/pages/chat',
    '/main/pages/mail-list',
    '/main/pages/wechat-moments',
    '/main/pages/my',
]

const secondPages = ['/my-chat', '/add-friend']

const methods = {
    async initAdmin() {
        const adminStore = useAdminStore()
        const adminToken = localStorage.getItem('adminToken')
        if (!adminToken) {
            const result = await getAdminToken({
                grant_type: 'client_credentials',
                client_id: baseConfig.clientID,
                client_secret: baseConfig.clientSecret,
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
    },
    initUser() {
        const userStore = useUserStore()
        const chatStore = useChatStore()
        const userToken = localStorage.getItem('userToken')
        if (!userToken) {
            router.replace('/begin')
            return
        }
        const userId = localStorage.getItem('userId')
        userStore.setToken(userToken)
        userStore.setUserID(userId || '')
        chatStore.setUserId(userId || '')
    },
    async init() {
        await methods.initAdmin()
        methods.initUser()
        chatStore.connect()
    },
}

EaseChatSDK.logger.disableAll()
// connect监听
EaseChatClient.addEventHandler('connection', {
    onConnected: () => {
        console.log('>>>>>环信连接成功')

        /** 获取会话列表 */
        chatListStore.getChatList()
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

// // message 相关监听
// EaseChatClient.addEventHandler('messageListen', {
//     // 收到文本消息。
//     onTextMessage: (message) => {
//         console.log('>>>>>>>App mesage', message, message.type)
//     },

//     // 收到表情消息。报错（暂时不知原因）
//     // onEmojiMessage: () => {},

//     // 收到图片消息。
//     onImageMessage: (message) => {
//         console.log('收到图片消息。', message)
//     },
//     // 收到命令消息。
//     onCmdMessage: (message) => {
//         console.log('>>>>>收到命令消息', message)
//     },
//     // 收到音频消息。
//     onAudioMessage: () => {
//         console.log('收到音频消息。')
//     },
//     // 收到位置消息。
//     onLocationMessage: () => {
//         console.log('收到位置消息。')
//     },
//     // 收到文件消息。
//     onFileMessage: () => {
//         console.log('收到文件消息。')
//     },
//     // 收到自定义消息。
//     onCustomMessage: () => {
//         console.log('收到自定义消息。')
//     },
//     // 收到视频消息。
//     onVideoMessage: () => {
//         console.log('收到视频消息。')
//     },
//     // 收到消息撤回回执。
//     onRecallMessage: () => {
//         console.log('收到消息撤回回执。')
//     },
// })

router.beforeEach((to, from) => {
    console.log('>>>>>>>>> App beforeEach')
    // methods.setTabbar()

    const secondBack = () =>
        secondPages.includes(from.path) && showTabbarList.includes(to.path)

    const fadeOutAnimate = () =>
        fromList.includes(from.path) && toList.includes(to.path)

    if (
        showTabbarList.includes(from.path) &&
        showTabbarList.includes(to.path)
    ) {
        console.log('页面同级切换')
        transitionName.value = ''
    } else if (
        /**
         *  TODO 二级页面返回一级页面时，需要淡出动画,还有一部分也需要
         */
        secondBack() ||
        fadeOutAnimate()
    ) {
        console.log('子页面返回')
        transitionName.value = 'fade-out'
    } else {
        console.log('进入子页面')
        transitionName.value = 'fade-in'
    }
})

methods.init()
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
