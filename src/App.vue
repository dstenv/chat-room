<script setup lang="ts">
import {
    EaseChatClient,
    EaseChatSDK,
    baseConfig,
    chatRoomBaseConfig,
} from '@/utils/config'
import { useAdminStore, useUserStore } from '@/stores/user'
import { getAdminToken } from '@/apis/getAdminToken'
import Tool from '@/utils/tools'
import { useChatStore } from '@/stores/chat'
import { db } from './utils/indexDB'

interface AdminStorage {
    application: string
    time: number
    token: string
}

interface TabbarItem<T> {
    name: T[keyof T]
    text: string
    path: keyof T
    // 激活icon
    activeIcon: string
    // 未激活icon
    inActiveIcon: string
}

const RouteItem = {
    'chat': 'CHAT',
    'mail-list': 'MAIL-LIST',
    'wechat-moments': 'WECHAT-MOMENTS',
    'my': 'MY',
}

const route = useRoute()
const chatStore = useChatStore()
const router = useRouter()

const activeIndex = ref(0)
const transitionName = ref('fade-in')

const toList: string[] = ['/chat']
const fromList: string[] = []
/**
 * TODO 显示tabbar的路由
 */
const showTabbarList = ['/chat', '/mail-list', '/wechat-moments', '/my']
const tabbar = ref<TabbarItem<typeof RouteItem>[]>([
    {
        text: '消息',
        name: 'CHAT',
        path: 'chat',
        activeIcon: 'msg_active.png',
        inActiveIcon: 'msg_inactive.png',
    },
    {
        text: '通讯录',
        name: 'MAIL-LIST',
        path: 'mail-list',
        activeIcon: 'mail_list_active.png',
        inActiveIcon: 'mail_list_inactive.png',
    },
    {
        text: '发现',
        name: 'WECHAT-MOMENTS',
        path: 'wechat-moments',
        activeIcon: 'discover_active.png',
        inActiveIcon: 'discover_inactive.png',
    },
    {
        text: '我的',
        name: 'MY',
        path: 'my',
        activeIcon: 'my_active.png',
        inActiveIcon: 'my_inactive.png',
    },
])

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

const init = async () => {
    for (let i = 0; i < tabbar.value.length; i++) {
        if (tabbar.value[i].name === route?.name) {
            activeIndex.value = i
            break
        }
    }
    await initAdmin()
    initUser()
    await chatStore.connect()
}

const initDataBase = () => {}

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
    if (from.path === '/') {
        db.open()
    }

    if (
        showTabbarList.includes(from.path) &&
        showTabbarList.includes(to.path)
    ) {
        transitionName.value = ''
    } else if (from.path === '/my-chat' && showTabbarList.includes(to.path)) {
        transitionName.value = 'fade-out'
    } else {
        transitionName.value = 'fade-in'
    }
})

init()
</script>

<template>
    <router-view v-slot="{ Component }">
        <transition :name="transitionName">
            <KeepAlive>
                <component
                    :is="Component"
                    :key="route.name"
                    v-if="route.meta.keep"
                />
            </KeepAlive>
        </transition>
        <transition :name="transitionName">
            <component
                :is="Component"
                :key="route.name"
                v-if="!route.meta.keep"
            />
        </transition>
    </router-view>

    <van-tabbar
        v-model="activeIndex"
        active-color="#59e062"
        v-if="showTabbarList.includes(route.path)"
    >
        <van-tabbar-item
            v-for="(item, index) in tabbar"
            :key="index"
            :to="item.path"
        >
            <template #icon="props">
                <div style="text-align: center">
                    <img
                        :src="
                            props.active
                                ? Tool.getUrl(item.activeIcon)
                                : Tool.getUrl(item.inActiveIcon)
                        "
                    />
                    <span style="font-size: 14rem">{{ item.text }}</span>
                </div>
            </template>
        </van-tabbar-item>
    </van-tabbar>
</template>

<style lang="scss" scoped>
.van-tabbar {
    background-color: #fff;
    padding-top: 10rem;
    img {
        display: block;
        margin: 0 auto;
        height: 22rem;
    }
}
.van-tabbar--fixed {
    // bottom: 18rem;
}

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
