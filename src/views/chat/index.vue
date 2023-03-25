<template>
    <div class="chat">
        <XHeader title="消息">
            <template #right>
                <VanPopover
                    v-model:show="pageData.showAddList"
                    placement="bottom-end"
                    theme="dark"
                    :offset="[14, 10]"
                >
                    <div class="add-list">
                        <div
                            class="add-item"
                            v-for="(item, index) in addList"
                            :key="index"
                            @click="
                                () => {
                                    pageData.showAddList = false
                                    item.action && item.action()
                                }
                            "
                        >
                            <img :src="item.icon" alt="" />
                            <span>{{ item.text }}</span>
                        </div>
                    </div>

                    <template #reference>
                        <img
                            class="add-friend-img"
                            :src="Tool.getUrl('add-gray.png')"
                            alt=""
                        />
                    </template>
                </VanPopover>
            </template>

            <template #custom>
                <div class="search c-bg">
                    <div>
                        <img :src="Tool.getUrl('search-gray.png')" alt="" />
                        搜索
                    </div>
                </div>
            </template>
        </XHeader>

        <div class="chat-list">
            <div
                class="chat-list-item"
                v-for="item in chatListStore.chatList"
                :key="item.lastMessage.to"
                @click="
                    () => {
                        chatStore.setTargetId(item.lastMessage.to)

                        friendStore.setFriend({
                            avatar: item.lastMessage.payload.avatar,
                            sex: item.lastMessage.payload.sex || '1',
                            nickname:
                                item.lastMessage.payload.nickname ||
                                item.lastMessage.to,
                            userid: item.lastMessage.to,
                        })

                        router.push('/my-chat')
                    }
                "
            >
                <template v-if="item.lastMessage.payload">
                    <div class="left">
                        <img :src="item.lastMessage.payload?.avatar" alt="" />
                    </div>
                    <div class="info">
                        <div class="center">
                            <p>
                                {{
                                    item.lastMessage.payload.nickname ||
                                    item.lastMessage.to
                                }}
                            </p>
                            <span>{{ (item.lastMessage as any).msg }}</span>
                        </div>
                        <div class="right">
                            <span>{{
                                Tool.showMsgTime((item.lastMessage as any).time)
                            }}</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EaseChatClient } from '@/utils/config'
import { showToast } from 'vant'
import Tool from '@/utils/tools'
import { useChatListStore } from '@/stores/chatList'
import { useChatStore } from '@/stores/chat'
import { useFriendStore } from '@/stores/friend'

interface AddListItem {
    text: string
    icon: string
    action?: () => void
}

const chatListStore = useChatListStore()
const chatStore = useChatStore()
const friendStore = useFriendStore()
const router = useRouter()

const addList: AddListItem[] = [
    {
        text: '发起群聊',
        icon: Tool.getUrl('icon-room.png'),
        action() {
            console.log('发起群聊', 'desc')
        },
    },
    {
        text: '添加朋友',
        icon: Tool.getUrl('icon-add-user.png'),
        action() {
            console.log('添加朋友', 'desc')
        },
    },
    {
        text: '扫一扫',
        icon: Tool.getUrl('icon-sweep.png'),
        action() {
            console.log('扫一扫', 'desc')
        },
    },
    {
        text: '收付款',
        icon: Tool.getUrl('icon-money.png'),
        action() {
            console.log('收付款', 'desc')
        },
    },
]

const pageData = reactive({
    showAddList: false,
})

EaseChatClient.addEventHandler('chatConnect', {
    onDisconnected: () => {
        showToast('已断线')
    },
})

console.log('chatListStore -->', chatListStore.chatList)

onActivated(() => {
    console.log('>>>>>>> cahtpage onActivated')
    // methods.getChatList()
})
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}
.chat {
    height: calc(100vh - 60rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .search {
        position: relative;
        padding: 10rem;
        div {
            background-color: #fff;
            border-radius: 5rem;
            padding: 8rem 0;
            letter-spacing: 1rem;
            font-size: 14rem;
            color: #8b8b8b;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 14rem;
                margin-right: 5rem;
            }
        }
    }
}
.chat-list {
    flex: 1;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 10rem;
    .chat-list-item {
        display: flex;
        padding: 10rem 0 0;
        .left,
        .right {
            flex: none;
        }
        .left {
            padding-left: 10rem;
            img {
                width: 40rem;
                display: block;
            }
        }
        .info {
            flex: 1;
            display: flex;
            justify-content: space-between;
            padding: 3rem 10rem 10rem 0;
            margin-left: 8rem;
            border-bottom: 1rem solid #ddd;
        }
        .center {
            p {
                font-weight: 500;
                font-size: 15rem;
                margin-bottom: 5rem;
            }
            span {
                color: #7a7a7a;
            }
        }
        .right {
            span {
                color: #7a7a7a;
            }
        }
        &:active {
            background-color: #d5d5d5;
        }
    }
}
.add-friend-img {
    width: 100%;
}
.add-list {
    padding: 5rem 10rem;
    .add-item {
        white-space: nowrap;
        padding: 10rem;
        display: flex;
        align-items: center;
        font-size: 14rem;
        border-bottom: 1rem solid #5c5c5c;
        img {
            width: 18rem;
            outline: none;
            vertical-align: baseline;
            margin-right: 8rem;
        }
        &:last-of-type {
            border-bottom: 0rem solid transparent;
        }
    }
}
:deep(.van-popover[data-popper-placement='bottom'] .van-popover__arrow) {
    right: 10rem;
}
</style>
