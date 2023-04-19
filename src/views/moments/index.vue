<template>
    <div class="moments">
        <div class="head c-bg">
            <img
                :src="Tools.getUrl('back-white.png')"
                alt=""
                @click="router.back"
            />
            <img
                :src="Tools.getUrl('camera-white.png')"
                alt=""
                @touchstart="touchStart"
                @touchmove="touchMove"
                @touchend="touchEnd"
                @click="pushImg"
            />
        </div>

        <main>
            <div class="user">
                <img
                    :src="
                        Tools.getDefaultAvatar(
                            userStore.userInfo?.sex === '2',
                            userStore.userInfo?.avatar
                        )
                    "
                    alt=""
                />
                <span>{{
                    userStore.userInfo?.nickname || userStore.userId
                }}</span>
            </div>

            <div class="box">
                <div
                    class="moment-item"
                    v-for="item in showList"
                    :key="item.id"
                >
                    <img
                        :src="item.ext?.avatar"
                        alt=""
                        @error="(e) => {
                            (e.target as HTMLImageElement).src = (Tools.getUrl('avatar-default-uman.png'))
                        }"
                    />
                    <div class="info">
                        <p>{{ item.ext?.name }}</p>

                        <div class="text-content">
                            {{
                                (item as EasemobChat.CustomMsgBody).customExts
                                    .text
                            }}
                        </div>

                        <div class="img-content">
                            <img
                                v-for="(url, index) in (item as EasemobChat.CustomMsgBody).customExts.files"
                                :key="url"
                                :src="url"
                                alt=""
                                @click="
                                    previewImg(
                                        index,
                                        (item as EasemobChat.CustomMsgBody)
                                            .customExts.files
                                    )
                                "
                            />
                        </div>

                        <div class="oprate">
                            <div>点赞和评论</div>
                            <div>图标</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <VanPopup position="bottom" v-model:show="pageData.showPopup">
            <Publish
                :type="pageData.publishType"
                @hide="() => (pageData.showPopup = false)"
            />
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { Tools } from '@/utils/tools'
import Publish from './components/publish.vue'
import { EaseChatClient } from '@/utils/config'
import { useChatStore } from '@/stores/chat'
import { useChatListStore } from '@/stores/chatList'
import type { EasemobChat } from 'easemob-websdk'
import { showImagePreview } from 'vant'

export type PublishType = 'txt' | 'img'

const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()
const chatListStore = useChatListStore()

let start = 0
const watchFnId = `moments_${Date.now().toString(36).slice(0, 11)}`

/**
 * TODO 这里还需要做处理(处理点赞的和评论的数据,放在ext属性中)
 */
const showList = computed(() =>
    chatStore.messageList
        .filter((item) => item.type === 'custom' && item.customExts)
        .reverse()
)

const pageData = reactive({
    longTouch: false,
    timer: null as null | number,
    publishType: 'img' as PublishType,
    showPopup: false,
})

const longFn = () => {
    console.log('长按')
    // 执行操作
    pageData.publishType = 'txt'
    pageData.showPopup = true
    pageData.longTouch = true
}

const pushImg = () => {
    pageData.publishType = 'img'
    pageData.showPopup = true
    pageData.longTouch = false
    console.log('点击')
}

const init = () => {
    chatStore.setchatData(chatListStore.momentGroup.groupid, 'groupChat')
    chatStore.getHistoryMsg()
}

const touchStart = () => {
    start = +new Date()
    pageData.timer = setTimeout(() => {
        longFn()
    }, 2000)
}

const touchMove = () => {
    if (pageData.timer) {
        clearTimeout(pageData.timer)
        pageData.timer = null
        pageData.longTouch = false
    }
}

const touchEnd = (e: TouchEvent) => {
    if (pageData.timer) {
        clearTimeout(pageData.timer)
        pageData.timer = null
        pageData.longTouch = false
        if (+new Date() - start > 100) {
            e.preventDefault()
        }
    }
}

const previewImg = (index: number, imgs: string[]) => {
    showImagePreview({
        images: imgs,
        loop: false,
        startPosition: index,
    })
}

init()

EaseChatClient.addEventHandler(watchFnId, {
    onCustomMessage(msg) {
        console.log('收到朋友圈的自定义消息 -->', msg)
        chatStore.addMessage({ ...msg, loading: false, error: false })
    },
})
</script>

<style scoped lang="scss">
.moments {
    overflow: hidden;
    background-color: #eeeeee;
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10rem 15rem;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        img {
            width: 30rem;
        }
    }
    main {
        margin-top: 50rem;
        background-color: #fff;
        padding: 80rem 0 0;
        overflow-x: hidden;
        max-height: calc(100vh - 50rem);
        .user {
            padding: 0 20rem;
            display: flex;
            align-items: center;
            border-radius: 5rem;
            position: relative;
            z-index: 10;
            img {
                width: 60rem;
                border-radius: 5rem;
            }
            span {
                margin-left: 10rem;
                font-size: 18rem;
                font-weight: bold;
                // color: #fff;
            }
        }
        .box {
            position: relative;
            top: -12rem;
            z-index: 5;
            padding: 40rem 20rem 0;
            box-shadow: 0 -5rem 10rem 7rem rgba(214, 214, 214);
            background-color: #fff;
            .moment-item {
                display: flex;
                padding: 10rem 0;
                border-bottom: 1rem solid #e2e2e2;
                & > img {
                    flex: none;
                    width: 40rem;
                    height: 40rem;
                    object-fit: cover;
                }
                .info {
                    flex: 1;
                    padding: 5rem 0 10rem 8rem;
                    & > p {
                        font-size: 16rem;
                        color: #687492;
                        font-weight: bold;
                        padding-bottom: 5rem;
                    }
                    .text-content {
                        font-size: 14rem;
                        font-weight: 500;
                        padding-bottom: 5rem;
                    }
                    .img-content {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 5rem;
                        padding-bottom: 20rem;
                        img {
                            width: 90rem;
                            height: 90rem;
                            object-fit: contain;
                        }
                    }
                    .oprate {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                    }
                }
            }
        }
    }
}
</style>
