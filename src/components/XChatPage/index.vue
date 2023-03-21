<template>
    <div class="x-chat">
        <div class="x-chat-head">
            <img
                :src="tools.getUrl('back.png')"
                alt=""
                @click="router.back()"
            />
            <span>{{ friendStore.friend?.nickname || '未知' }}</span>
            <img :src="tools.getUrl('many.png')" alt="" />
        </div>

        <main ref="mainRef">
            <VanPullRefresh
                pulling-text="获取历史消息"
                v-model="pageData.refresh"
                @refresh="methods.getHistory"
            >
                <div class="msg-list" ref="listRef">
                    <MessageItem
                        v-for="item in chatStore.messageList"
                        :key="item.keyId || item.id"
                        :item="item"
                    />
                </div>
            </VanPullRefresh>
        </main>

        <Footer
            :opposite-id="pageData.id"
            @scrollBottom="methods.scrollToBottom"
        />
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useFriendStore } from '@/stores/friend'
import { EaseChatClient } from '@/utils/config'
import tools from '@/utils/tools'
import Footer from './components/footer.vue'
import MessageItem from './components/message-item.vue'

enum ScrollType {
    None,
    Keep,
    Bottom,
}

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const friendStore = useFriendStore()

const mainRef = ref<HTMLElement>({} as HTMLElement)
const listRef = ref<HTMLElement>({} as HTMLElement)

/** 监听事件回调的id */
const watchFnId = `chat_page_${Date.now().toString(36)}${Math.floor(
    Math.random() * 100 + 1 + 1
)}`

const pageData = reactive({
    id: friendStore.friend?.userid || '',
    refresh: false,
})

const scrollData = reactive({
    scrollTop: 0,
    type: ScrollType.None,
    height: 0,
    differHeight: 0,
    behavior: false,
})

const resizeObserver = new ResizeObserver((entries) => {
    if (entries && entries[0]) {
        const contentRect = entries[0].contentRect

        scrollData.differHeight =
            contentRect.height - mainRef.value.clientHeight - 30
        scrollData.height = contentRect.height

        if (scrollData.type !== ScrollType.None) {
            if (scrollData.type === ScrollType.Bottom) {
                // 滚动到底部

                mainRef.value.scrollTo({
                    top: scrollData.height + scrollData.scrollTop,
                    behavior: scrollData.behavior ? 'smooth' : 'auto',
                })
            } else {
                // 保持当前滚动高度
                mainRef.value.scrollTo({
                    top: scrollData.differHeight + scrollData.scrollTop,
                    behavior: 'auto',
                })
            }
        }
    }
})

const methods = {
    getHistory() {
        chatStore.getHistoryMsg()
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
}

EaseChatClient.addEventHandler(watchFnId, {
    onTextMessage: (message) => {
        console.log(message, '文本消息')
        chatStore.addMessage({ ...message, loading: false, error: false })
    },
})

onBeforeMount(() => {
    if (route.query.id) {
        chatStore.setTargetId(route.query.id as string)
    }
})

onMounted(() => {
    methods.scrollToBottom()
    resizeObserver.observe(listRef.value)
})

onBeforeUnmount(() => {
    if (listRef.value) {
        resizeObserver.unobserve(listRef.value)
    }
})

methods.getHistory()
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
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
    max-height: calc(100vh - 100rem);
    padding: 15rem 10rem;
    overflow-y: scroll;
}
.msg-list {
    display: flex;
    flex-direction: column;
    gap: 12rem;
    font-size: 14rem;
}
</style>
