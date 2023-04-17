<script setup lang="ts">
import { EaseChatClient, EaseChatSDK } from '@/utils/config'
import { useChatStore } from '@/stores/chat'
import { useChatListStore } from './stores/chatList'
// import { db } from './utils/indexDB'
import { init } from '@/utils/initApp'

const chatStore = useChatStore()
const router = useRouter()
const chatListStore = useChatListStore()

const transitionName = ref('fade-in')

/**
 * TODO 显示tabbar的路由
 */
const showTabbarList = [
    '/main/pages/chat',
    '/main/pages/mail-list',
    '/main/pages/wechat-moments',
    '/main/pages/my',
]

const secondPages = ['/my-chat', '/add-friend', '/new-friend', '/black-list']
const toList: string[] = ['/add-friend', ...showTabbarList]
const fromList: string[] = ['/search-user']

const methods = {
    async init() {
        const router = useRouter()
        await init.initAdmin()
        init.initUser(router)
        init.initNewFriend()
    },
}

EaseChatSDK.logger.disableAll()
// connect监听
EaseChatClient.addEventHandler('connection', {
    onConnected: () => {
        console.log('>>>>>环信连接成功')

        /** 监听message */
        chatListStore.watchMessage()
        /** 获取会话列表 */
        chatListStore.getChatList().then(() => {
            /** 获取群组列表 */
            chatListStore.getGroupList()
        })
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
    console.log('path -->', from.path, to.path)

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
        fadeOutAnimate() ||
        (from.path === '/add-friend' && to.path === '/new-friend')
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
