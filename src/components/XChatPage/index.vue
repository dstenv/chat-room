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

        <main>
            <VanPullRefresh
                pulling-text="获取历史消息"
                v-model="pageData.refresh"
                @refresh="methods.getHistory"
            >
                <div class="msg-list">
                    <MessageItem
                        v-for="item in chatStore.messageList"
                        :key="item.keyId || item.id"
                        :item="item"
                    />
                </div>
            </VanPullRefresh>
        </main>

        <Footer :opposite-id="pageData.id" />
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useFriendStore } from '@/stores/friend'
import { EaseChatClient } from '@/utils/config'
import tools from '@/utils/tools'
import Footer from './components/footer.vue'
import MessageItem from './components/message-item.vue'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const friendStore = useFriendStore()

/** 监听事件回调的id */
const watchFnId = `chat_page_${Date.now().toString(36)}${Math.floor(
    Math.random() * 100 + 1 + 1
)}`

const pageData = reactive({
    id: friendStore.friend?.userid || '',
    refresh: false,
})

const methods = {
    getHistory() {
        chatStore.getHistoryMsg()
    },
}

EaseChatClient.addEventHandler(watchFnId, {
    onTextMessage: (message) => {
        console.log(message, '文本消息')
        chatStore.addMessage({ ...message, loading: false, error: false })
    },
})
methods.getHistory()

onBeforeMount(() => {
    if (route.query.id) {
        chatStore.setTargetId(route.query.id as string)
    }
})
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
}
.msg-list {
    max-height: calc(100vh - 100rem);
    display: flex;
    flex-direction: column;
    gap: 12rem;
    font-size: 14rem;
    padding: 15rem 10rem;
}
</style>
