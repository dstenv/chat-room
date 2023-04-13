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
                            :src="Tools.getUrl('add-gray.png')"
                            alt=""
                        />
                    </template>
                </VanPopover>
            </template>

            <template #custom>
                <XSearch />
            </template>
        </XHeader>
        <!-- chatListStore.chatList.length > 0 -->
        <div class="chat-list" v-if="chatListStore.chatList.length > 0">
            <div
                class="chat-list-item"
                v-for="item in chatListStore.chatList"
                :key="item.lastMessage.to"
                @click="
                    () => {
                        chatStore.setTargetId(
                            item.lastMessage.to === userStore.userId
                                ? item.lastMessage.from
                                : item.lastMessage.to
                        )

                        friendStore.setFriend({
                            avatar: item.lastMessage.payload.avatar,
                            sex: item.lastMessage.payload.sex || '1',
                            nickname:
                                item.lastMessage.payload.nickname ||
                                item.lastMessage.to === userStore.userId
                                    ? item.lastMessage.from
                                    : item.lastMessage.to,
                            userid:
                                item.lastMessage.to === userStore.userId
                                    ? item.lastMessage.from
                                    : item.lastMessage.to,
                            onLine: false,
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
                                    item.himId
                                }}
                            </p>
                            <span
                                v-if="(item.lastMessage as any).type === 'txt'"
                                >{{ (item.lastMessage as any).msg }}</span
                            >
                            <span
                                v-if="(item.lastMessage as any).type === 'img'"
                                >[图片]</span
                            >
                            <span
                                v-if="(item.lastMessage as any).type === 'video'"
                                >[视频]</span
                            >
                        </div>
                        <div class="right">
                            <span>{{
                                Tools.showMsgTime(
                                    (item.lastMessage as any).time
                                )
                            }}</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <template v-else>
            <XEmpty :img="Tools.getUrl('chat-empty.png', 'imgs')" />
        </template>

        <!-- 弹出层 -->
        <VanPopup
            :show="pageData.showCreateGroup"
            position="bottom"
            :overlay="false"
        >
            <div class="create-group">
                <div class="head c-bg">
                    <img
                        :src="Tools.getUrl('close-gray.png')"
                        alt=""
                        @click="closeCreateGroup"
                    />
                    <p>选择联系人</p>
                    <div class="empty-box" />
                </div>

                <div class="search">
                    <input
                        type="text"
                        enterkeyhint="search"
                        v-model="pageData.createGroupSearch"
                        placeholder="输入用户名或id搜索"
                        maxlength="100"
                        @input="search"
                    />
                    <img :src="Tools.getUrl('search-gray.png')" alt="" />
                </div>

                <VanCheckboxGroup
                    v-model="pageData.friendIds"
                    checked-color="#59ce61"
                    class="select-box"
                >
                    <VanCheckbox
                        v-for="item in pageData.showList"
                        :key="item.userid"
                        :name="item.userid"
                    >
                        <SelectFriend :info="item" />
                    </VanCheckbox>
                </VanCheckboxGroup>
            </div>
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
import { EaseChatClient } from '@/utils/config'
import { showToast } from 'vant'
import { Tools } from '@/utils/tools'
import { useChatListStore } from '@/stores/chatList'
import { useChatStore } from '@/stores/chat'
import { useFriendStore } from '@/stores/friend'
import XSearch from '@/components/XSearch/index.vue'
import { useUserStore } from '@/stores/user'
import XEmpty from '@/components/XEmpty/index.vue'
import SelectFriend from './components/select-friend.vue'
import type { UserProPertyType } from '@/types'

interface AddListItem {
    text: string
    icon: string
    action?: () => void
}

const chatListStore = useChatListStore()
const chatStore = useChatStore()
const friendStore = useFriendStore()
const userStore = useUserStore()
const router = useRouter()

const addList: AddListItem[] = [
    {
        text: '发起群聊',
        icon: Tools.getUrl('icon-room.png'),
        action() {
            console.log('发起群聊', 'desc')
            pageData.showList = chatListStore.friendList
            pageData.showCreateGroup = true
        },
    },
    {
        text: '添加朋友',
        icon: Tools.getUrl('icon-add-user.png'),
        action() {
            // console.log('添加朋友', 'desc')
            router.push('/add-friend')
        },
    },
    {
        text: '扫一扫',
        icon: Tools.getUrl('icon-sweep.png'),
        action() {
            console.log('扫一扫', 'desc')
        },
    },
    {
        text: '收付款',
        icon: Tools.getUrl('icon-money.png'),
        action() {
            console.log('收付款', 'desc')
        },
    },
]

const pageData = reactive({
    showAddList: false,
    /** 展示创建群聊 */
    showCreateGroup: false,
    /** 选中的好友的id */
    friendIds: [] as string[],
    /** 创建群聊时的搜索值 */
    createGroupSearch: '',
    showList: [] as UserProPertyType[],
})

EaseChatClient.addEventHandler('chatConnect', {
    onDisconnected: () => {
        showToast('已断线')
    },
    onTextMessage: (message) => {
        chatStore.addMessage({ ...message, loading: false, error: false })
        chatListStore.setLastMsg(message.from || '', message.msg, true)
    },
    onImageMessage: (message) => {
        chatStore.addMessage({ ...message, loading: false, error: false })
        chatListStore.setLastMsg(message.from || '', '[图片]', true)
    },
    onVideoMessage: (message) => {
        chatStore.addMessage({ ...message, loading: false, error: false })
        chatListStore.setLastMsg(message.from || '', '[视频]', true)
    },
})

console.log('chatListStore -->', chatListStore.chatList)

const closeCreateGroup = () => {
    pageData.friendIds = []
    pageData.createGroupSearch = ''
    pageData.showCreateGroup = false
}

const search = Tools.doubonce(() => {
    if (!pageData.createGroupSearch) {
        pageData.showList = chatListStore.friendList
        return
    }

    pageData.showList = pageData.showList.filter((item) =>
        [item.userid, item.nickname].includes(pageData.createGroupSearch)
    )
})

// onActivated(() => {
//     console.log('>>>>>>> cahtpage onActivated')
//     // methods.getChatList()
//     emits('setTabbar')
// })
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
            max-width: 276rem;
            p,
            sapn {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            p {
                font-weight: 500;
                font-size: 15rem;
                margin-bottom: 5rem;
            }
            span {
                display: block;
                color: #7a7a7a;
                font-size: 12rem;
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
.create-group {
    height: 100vh;
    width: 100vw;
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15rem;
        & > img {
            width: 20rem;
        }
        & > p {
            text-align: center;
            font-size: 16rem;
            font-weight: bold;
        }
        .empty-box {
            width: 20rem;
            height: 20rem;
        }
    }
    .search {
        position: relative;
        input {
            padding: 10rem 0;
            width: 100%;
            border: none;
            border-bottom: 1rem solid #ddd;
            font-size: 14rem;
            box-sizing: border-box;
            padding-left: 40rem;
        }
        img {
            width: 20rem;
            position: absolute;
            top: 50%;
            left: 10rem;
            transform: translate(0, -55%);
        }
    }
    .select-box {
        padding: 10rem;
    }
}
.add-friend-img {
    width: 22rem;
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
:deep(.van-checkbox__label) {
    flex: 1;
}
</style>
