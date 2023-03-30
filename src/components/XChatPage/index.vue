<template>
    <div class="x-chat">
        <div class="x-chat-head">
            <img
                :src="Tools.getUrl('back.png')"
                alt=""
                @click="router.back()"
            />
            <span>{{ friendStore.friend?.nickname || '未知' }}</span>
            <img :src="Tools.getUrl('many.png')" alt="" />
        </div>

        <main ref="mainRef" :class="{ shinrk: pageData.isSelFuns }">
            <VanPullRefresh
                pulling-text="获取历史消息"
                v-model="pageData.refresh"
                :disabled="chatStore.allHistory"
                @refresh="methods.getHistory"
            >
                <div class="msg-list" ref="listRef">
                    <MessageItem
                        v-for="item in chatStore.messageList"
                        :key="item.keyId || item.id"
                        :item="item"
                        @addImage="previewImage.addImg"
                        @click="methods.msgClick"
                    />
                </div>
            </VanPullRefresh>
        </main>

        <Footer
            :is-sel-funs="pageData.isSelFuns"
            :opposite-id="pageData.id"
            @scrollBottom="methods.scrollToBottom"
            @toggle-funs="
                ({ bool, isBehavior }) => {
                    methods.scroll(isBehavior)

                    pageData.isSelFuns = bool
                }
            "
        />
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useChatListStore } from '@/stores/chatList'
import { useFriendStore } from '@/stores/friend'
import { EaseChatClient } from '@/utils/config'
import { Tools } from '@/utils/tools'
import type { EasemobChat } from 'easemob-websdk'
import Footer from './components/footer.vue'
import MessageItem from './components/message-item.vue'
import { usePreviewImage } from '@/hooks/preview-image'
import type { MessageData, SendMsgType } from '@/types/message'

enum ScrollType {
    None,
    Keep,
    Bottom,
}

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const friendStore = useFriendStore()
const chatListStore = useChatListStore()
const previewImage = usePreviewImage()

const mainRef = ref<HTMLElement>({} as HTMLElement)
const listRef = ref<HTMLElement>({} as HTMLElement)

/** 监听事件回调的id */
const watchFnId = `chat_page_${Date.now().toString(36)}${Math.floor(
    Math.random() * 100 + 1 + 1
)}`

const msgClickOprate: Partial<Record<SendMsgType, (id: string) => void>> = {
    img: (id) => {
        previewImage.preview(id)
    },
}

const pageData = reactive({
    id: friendStore.friend?.userid || '',
    refresh: false,
    /** 是否弹起底部功能区域 */
    isSelFuns: false,
})

const scrollData = reactive({
    scrollTop: 0,
    type: ScrollType.None,
    height: 0,
    differHeight: 0,
    behavior: false,
    beforeHeight: 0,
})

const resizeObserver = new ResizeObserver((entries) => {
    if (entries && entries[0]) {
        const contentRect = entries[0].contentRect

        scrollData.differHeight = contentRect.height - scrollData.beforeHeight
        scrollData.height = contentRect.height

        if (scrollData.type !== ScrollType.None) {
            if (scrollData.type === ScrollType.Bottom) {
                // 滚动到底部

                mainRef.value?.scrollTo({
                    top: scrollData.height + scrollData.scrollTop,
                    behavior: scrollData.behavior ? 'smooth' : 'auto',
                })
            } else {
                scrollData.scrollTop += scrollData.differHeight

                // 保持当前滚动高度
                mainRef.value?.scrollTo({
                    top: scrollData.scrollTop,
                    behavior: 'auto',
                })
            }
        }
    }
})

const methods = {
    async getHistory() {
        scrollData.beforeHeight = listRef.value.scrollHeight - 30

        methods.keepScroll()

        await chatStore.getHistoryMsg()
        pageData.refresh = false
    },

    /** 设置滚动到底部 */
    scrollToBottom(behavior = false) {
        scrollData.type = ScrollType.Bottom
        scrollData.behavior = behavior
    },

    /** 设置保持当前位置 */
    keepScroll() {
        scrollData.type = ScrollType.Keep
        scrollData.behavior = false
    },

    /** 滚动到底部 */
    scroll(isBehavior: boolean) {
        requestAnimationFrame(() => {
            mainRef.value.scrollTo({
                top: listRef.value.scrollHeight,
                behavior: isBehavior ? 'smooth' : 'auto',
            })
        })
    },

    msgClick({ id, type }: { id: string; type: SendMsgType }) {
        msgClickOprate[type]!(id)
    },
}

EaseChatClient.addEventHandler(watchFnId, {
    onTextMessage: (message) => {
        console.log(message, '文本消息')
        chatStore.addMessage({ ...message, loading: false, error: false })
    },
})

onBeforeMount(() => {
    if (pageData.id) {
        chatStore.setTargetId(pageData.id as string)
    }
})

onMounted(() => {
    methods.scrollToBottom()
    resizeObserver.observe(listRef.value)
})

onBeforeUnmount(async () => {
    console.log('聊天页 onBeforeUnmount', chatStore.socketDefer.send)
    /** 更新会话列表 */
    if (chatStore.socketDefer.send) {
        await chatStore.socketDefer.send.promise
        chatListStore.setLastMsg(
            pageData.id,
            (
                chatStore.messageList[
                    chatStore.messageList.length - 1
                ] as EasemobChat.TextMsgBody
            ).msg
        )
    } else {
        chatListStore.setLastMsg(
            pageData.id,
            (
                chatStore.messageList[
                    chatStore.messageList.length - 1
                ] as EasemobChat.TextMsgBody
            ).msg
        )
    }

    if (listRef.value) {
        resizeObserver.unobserve(listRef.value)
    }

    chatStore.clean()
})

chatStore.getHistoryMsg()
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}
.van-pull-refresh {
    overflow: initial;
}
.x-chat {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
.x-chat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rem;
    background-color: rgba(230, 230, 230, 0.7);
    img {
        display: block;
        width: 20rem;
    }
    span {
        font-size: 14rem;
        font-weight: 500;
    }
}
main {
    box-sizing: border-box;
    height: calc(100vh - 100rem);
    padding: 0 10rem;
    overflow-y: scroll;
    &.shinrk {
        height: calc(100vh - 200rem);
    }
}
.msg-list {
    display: flex;
    flex-direction: column;
    gap: 15rem;
    font-size: 14rem;
    padding: 15rem 0;
    // min-height: calc(100vh - 100rem);
}
</style>
