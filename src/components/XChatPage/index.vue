<template>
    <div class="x-chat">
        <div class="x-chat-head">
            <img
                :src="tools.getUrl('back.png')"
                alt=""
                @click="router.back()"
            />
            <span>{{ nickname || '未知' }}</span>
            <img :src="tools.getUrl('many.png')" alt="" />
        </div>

        <main>
            <VanPullRefresh>
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
import { EaseChatClient } from '@/utils/config'
import tools from '@/utils/tools'
import Footer from './components/footer.vue'
import MessageItem from './components/message-item.vue'
import { db } from '@/utils/indexDB'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()

const { nickname, id } = route.query as {
    nickname: string
    id: string
}

/** 监听事件回调的id */
const watchFnId = `chat_page_${Date.now().toString(36)}${Math.floor(
    Math.random() * 100 + 1 + 1
)}`

const pageData = reactive({
    id,
})

const getHistoryMsg = async () => {
    try {
        const list = await db.findSourceByTable('message')
        console.log(list, 'list')
    } catch (error) {}
}

EaseChatClient.addEventHandler(watchFnId, {
    onTextMessage: (message) => {
        console.log(message, '文本消息')
        chatStore.addMessage({ ...message, loading: false, error: false })
    },
})
getHistoryMsg()
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
    max-height: calc(100vh - 100rem);
}
</style>
