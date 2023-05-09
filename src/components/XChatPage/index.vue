<template>
    <div class="x-chat">
        <div class="x-chat-head">
            <img
                :src="Tools.getUrl('back.png')"
                alt=""
                @click="router.back()"
            />
            <span>{{ name || '未知' }}</span>
            <img
                :src="Tools.getUrl('many.png')"
                alt=""
                @click="() => (pageData.editChat = true)"
            />
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

        <VanPopup position="right" :show="pageData.editChat" :overlay="false">
            <div class="edit-chat c-bg">
                <div class="head">
                    <div class="left">
                        <img
                            :src="Tools.getUrl('back.png')"
                            alt=""
                            @click="() => (pageData.editChat = false)"
                        />
                    </div>
                    <div class="center">会话操作</div>
                    <div class="right" />
                </div>

                <div class="edit-main">
                    <div
                        class="item"
                        v-for="item in chatOprateList"
                        :key="item.text"
                        @click="item.action"
                    >
                        <span>{{ item.text }}</span>
                        <img v-if="item.icon" :src="item.icon" alt="" />
                    </div>
                    <div class="item delete" @click="methods.deleteChat">
                        删除会话
                    </div>
                </div>
            </div>
        </VanPopup>
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
import { getOnlineStatus } from '@/apis/friend/getOnlineStatus'
import { showConfirmDialog, showSuccessToast } from 'vant'

enum ScrollType {
    None,
    Keep,
    Bottom,
}

interface ChatOprateitem {
    text: string
    action: () => void
    icon?: string
}

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const friendStore = useFriendStore()
const chatListStore = useChatListStore()
const previewImage = usePreviewImage()

const { name } = route.query as {
    name: string
}

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

const lastMsgMap: Partial<Record<SendMsgType, (msg: MessageData) => string>> = {
    txt: (msg) => (msg as EasemobChat.TextMsgBody).msg,
    img: () => '[图片]',
    video: () => '[视频]',
}

const chatOprateList: ChatOprateitem[] = [
    {
        text: '删除本地记录',
        action() {
            showConfirmDialog({
                message:
                    '是否确认删除本地会话记录(50条/次)？对方仍可查看会话记录，此操作不可逆！',
            })
                .then(async () => {
                    console.log('chatData -->', chatStore.chatData)
                    try {
                        await EaseChatClient.removeHistoryMessages({
                            targetId: chatStore.chatData.targetId,
                            chatType: chatStore.chatData.chatType as
                                | 'singleChat'
                                | 'groupChat',
                            beforeTimeStamp: 100,
                        })

                        showSuccessToast({
                            message: '删除成功',
                            duration: 100,
                        })

                        setTimeout(() => {
                            methods.scrollToBottom(true)
                            methods.getHistory()
                            pageData.editChat = false
                        }, 100)
                    } catch (error) {}
                })
                .catch(() => {})
        },
    },
]

const pageData = reactive({
    id: friendStore.friend?.userid || '',
    refresh: false,
    /** 是否弹起底部功能区域 */
    isSelFuns: false,
    userStatus: false,
    editChat: false,
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
                /**
                 * TODO Bug: 获取完历史消息会滚动到底部
                 */
                scrollData.scrollTop += scrollData.differHeight
                console.log('scrollData.scrollTop -->', scrollData.scrollTop)

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
    async init() {
        await chatStore.getHistoryMsg()

        //  获取用户在线状态 im服务未开启
        // try {
        //     const status = EaseChatClient.getPresenceStatus({
        //         usernames: [friendStore.friend?.userid || ''],
        //     })
        //     console.log('status -->', status)
        // } catch (error) {
        // } finally {
        //     pageData.userStatus = false
        // }

        // try {
        //     const result = await getOnlineStatus({
        //         usernames: [friendStore.friend?.userid || ''],
        //     })
        //     console.log('result -->', result)
        // } catch (error) {}
    },

    async getHistory() {
        pageData.refresh = true

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
        msgClickOprate[type]?.(id)
    },

    deleteChat() {
        console.log('deletechat -->', chatStore.chatData)

        showConfirmDialog({
            message:
                '删除会话同时会删除历史消息，且会话和消息不可恢复，确认删除？',
        })
            .then(async () => {
                try {
                    await EaseChatClient.deleteConversation({
                        // 会话 ID：单聊为对方的用户 ID，群聊为群组 ID。
                        channel: chatStore.chatData.targetId,
                        // 会话类型：（默认） `singleChat`：单聊；`groupChat`：群聊。
                        chatType: chatStore.chatData.chatType as
                            | 'singleChat'
                            | 'groupChat',
                        // 删除会话时是否同时删除服务端漫游消息。
                        deleteRoam: true,
                    })

                    showSuccessToast({
                        message: '删除成功',
                        duration: 100,
                    })

                    setTimeout(() => {
                        router.replace('/main/pages/chat')
                    }, 100)
                } catch (error) {}
            })
            .catch(() => {})
    },
}

EaseChatClient.addEventHandler(watchFnId, {
    onTextMessage: (message) => {
        chatStore.addMessage({ ...message, loading: false, error: false })
        chatListStore.setLastMsg(message.from || '', message.msg)
    },
    onImageMessage: (message) => {
        chatStore.addMessage({ ...message, loading: false, error: false })
        chatListStore.setLastMsg(message.from || '', '[图片]')
    },
    onVideoMessage: (message) => {
        chatStore.addMessage({ ...message, loading: false, error: false })
        chatListStore.setLastMsg(message.from || '', '[视频]')
    },
})

onMounted(() => {
    methods.scrollToBottom()
    resizeObserver.observe(listRef.value)
})

onBeforeUnmount(async () => {
    console.log('聊天页 onBeforeUnmount', chatStore.socketDefer.send)

    const last = chatStore.messageList[chatStore.messageList.length - 1]
    if (last) {
        /** 更新会话列表 */
        if (chatStore.socketDefer.send) {
            await chatStore.socketDefer.send.promise
            chatListStore.setLastMsg(
                pageData.id,
                lastMsgMap[last.type]?.(last) || ''
            )
        } else {
            chatListStore.setLastMsg(
                pageData.id,
                lastMsgMap[last.type]?.(last) || ''
            )
        }
    }

    if (listRef.value) {
        resizeObserver.unobserve(listRef.value)
    }

    chatStore.clean()
})

methods.init()
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
    min-height: calc(100vh - 200rem);
}
.edit-chat {
    width: 100vw;
    height: 100vh;
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15rem;
        font-size: 14rem;
        .left {
            img {
                display: block;
                width: 20rem;
            }
        }
        .right {
            width: 20rem;
            height: 20rem;
        }
    }
    .edit-main {
        .item {
            background-color: #fff;
            padding: 15rem;
            margin-bottom: 10rem;
            font-size: 16rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &.delete {
                justify-content: center;
                color: red;
            }
        }
    }
}
</style>
