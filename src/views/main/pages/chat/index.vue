<template>
    <div>
        <div class="chat" v-if="!pageData.isSearch">
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
                    <XSearch @click="() => (pageData.isSearch = true)" />
                </template>
            </XHeader>
            <!-- chatListStore.chatList.length > 0 -->

            <main>
                <div class="section">
                    <p class="title">会话</p>
                    <div class="chat-list" v-if="chatList.length > 0">
                        <div
                            class="chat-list-item"
                            v-for="item in chatList"
                            :key="item.lastMessage.to"
                            @click="goChat(item)"
                        >
                            <template v-if="item.lastMessage.payload">
                                <div class="left">
                                    <img
                                        :src="item.lastMessage.payload?.avatar"
                                        alt=""
                                    />
                                </div>
                                <div class="info">
                                    <div class="center">
                                        <p class="text-over">
                                            {{
                                                item.lastMessage.payload
                                                    .nickname || item.himId
                                            }}
                                        </p>
                                        <span
                                            class="text-over"
                                            v-if="(item.lastMessage as any).type === 'txt'"
                                            >{{
                                                (item.lastMessage as any).msg
                                            }}</span
                                        >
                                        <span
                                            class="text-over"
                                            v-if="(item.lastMessage as any).type === 'img'"
                                            >[图片]</span
                                        >
                                        <span
                                            class="text-over"
                                            v-if="(item.lastMessage as any).type === 'video'"
                                            >[视频]</span
                                        >
                                    </div>
                                    <div class="right">
                                        <span>{{
                                            Tools.showMsgTime(
                                                (item.lastMessage as any)
                                                    .time ??
                                                    (item.lastMessage as any)
                                                        .timestamp
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
                </div>
                <!--
            <div class="section">
                <p class="title">群组</p>
                <div
                    class="group-list"
                    v-if="chatListStore.groupList.length > 0"
                >
                    <div
                        class="group-item"
                        v-for="item in chatListStore.groupList"
                        :key="item.groupid"
                        @click="
                            goGroupChat(
                                item.groupid,
                                item.groupname || item.groupid
                            )
                        "
                    >
                        <div class="left">
                            <img :src="item.groupimg" alt="" />
                        </div>
                        <div class="info text-over">
                            {{ item.groupname }}
                        </div>
                    </div>
                </div>
            </div> -->
            </main>

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

                    <div class="submit-friend">
                        <div class="submit-btn" @click="createGroup">
                            完成({{ pageData.friendIds.length }})
                        </div>
                    </div>
                </div>
            </VanPopup>
        </div>

        <div class="chat-search c-bg" v-else>
            <div class="header">
                <input
                    type="text"
                    enterkeyhint="search"
                    autofocus
                    ref="textRef"
                    v-model="pageData.searchValue"
                />
                <span
                    @click="
                        () => {
                            pageData.searchValue = ''
                            pageData.isSearch = false
                        }
                    "
                    >取消</span
                >
            </div>

            <div class="search-list" v-show="showSearchList.length > 0">
                <div
                    class="chat-list-item"
                    v-for="item in showSearchList"
                    :key="item.lastMessage.to"
                    @click="goChat(item)"
                >
                    <template v-if="item.lastMessage.payload">
                        <div class="left">
                            <img
                                :src="item.lastMessage.payload?.avatar"
                                alt=""
                            />
                        </div>
                        <div class="info">
                            <div class="center">
                                <p class="text-over">
                                    {{
                                        item.lastMessage.payload.nickname ||
                                        item.himId
                                    }}
                                </p>
                                <span
                                    class="text-over"
                                    v-if="(item.lastMessage as any).type === 'txt'"
                                    >{{ (item.lastMessage as any).msg }}</span
                                >
                                <span
                                    class="text-over"
                                    v-if="(item.lastMessage as any).type === 'img'"
                                    >[图片]</span
                                >
                                <span
                                    class="text-over"
                                    v-if="(item.lastMessage as any).type === 'video'"
                                    >[视频]</span
                                >
                            </div>
                            <div class="right">
                                <span>{{
                                    Tools.showMsgTime(
                                        (item.lastMessage as any).time ??
                                            (item.lastMessage as any).timestamp
                                    )
                                }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div v-show="showSearchList.length === 0">
                <XEmpty :img="Tools.getUrl('chat-empty.png', 'imgs')" />
            </div>
        </div>
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
import { CommonConfig } from '@/common/common'
import type { EasemobChat } from 'easemob-websdk'

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

const chatList = computed(() =>
    chatListStore.chatList.filter(
        (item) =>
            item.lastMessage.payload?.nickname !== 'moment' &&
            (item.lastMessage as any)?.type !== 'custom'
    )
)

const showSearchList = computed(() => {
    if (!pageData.searchValue.trim()) return []

    return chatList.value.filter((item) => {
        const arr = [item.himId, item.lastMessage.payload.nickname]

        for (let i = 0; i < arr.length; i++) {
            const reg = new RegExp(pageData.searchValue.trim(), 'i')

            if (reg.test(arr[i] as string)) {
                return true
            }
        }

        return false
    })
})

const pageData = reactive({
    showAddList: false,
    /** 展示创建群聊 */
    showCreateGroup: false,
    /** 选中的好友的id */
    friendIds: [] as string[],
    /** 创建群聊时的搜索值 */
    createGroupSearch: '',
    showList: [] as UserProPertyType[],

    isSearch: false,
    searchValue: '',
})

EaseChatClient.addEventHandler('chatConnect', {
    onDisconnected: () => {
        showToast('已断线')
        localStorage.clear()
        sessionStorage.clear()
        chatStore.clear()
        router.replace('/begin')
    },
    onTextMessage: (message) => {
        setTimeout(async () => {
            if (message.chatType === 'groupChat') {
                chatListStore.getChatList()
            }
        }, 300)

        console.log('消息', message)
        console.log(
            '@@@@',
            { ...message, loading: false, error: false },
            false,
            false
        )
        chatStore.addMessage(
            { ...message, loading: false, error: false },
            false,
            false
        )
        chatListStore.setLastMsg(message.from || '', message.msg, true)
    },
    onImageMessage: (message) => {
        setTimeout(async () => {
            if (message.chatType === 'groupChat') {
                chatListStore.getChatList()
            }
        }, 300)
        chatStore.addMessage(
            { ...message, loading: false, error: false },
            false,
            false
        )
        chatListStore.setLastMsg(message.from || '', '[图片]', true)
    },
    onVideoMessage: (message) => {
        setTimeout(async () => {
            if (message.chatType === 'groupChat') {
                chatListStore.getChatList()
            }
        }, 300)
        chatStore.addMessage(
            { ...message, loading: false, error: false },
            false,
            false
        )
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

    const list: UserProPertyType[] = []

    for (let i = 0; i < pageData.showList.length; i++) {
        const arr = [pageData.showList[i].userid, pageData.showList[i].nickname]

        for (let j = 0; j < arr.length; j++) {
            const reg = new RegExp(pageData.createGroupSearch, 'i')

            if (reg.test(arr[i] as string)) {
                list.push(pageData.showList[i])
                break
            }
        }
    }

    pageData.showList = [...list]
})

const createGroup = async () => {
    if (pageData.friendIds.length === 0) {
        showToast('请至少选择一个好友')
        return
    }

    let inviteNeedConfirm = true

    if (pageData.friendIds.length < CommonConfig.CREATE_GROUP_MAXUSER) {
        inviteNeedConfirm = false
    }

    const groupname = `${userStore.userId}、${pageData.friendIds.join('、')}`

    try {
        const result = await EaseChatClient.createGroup({
            data: {
                ...CommonConfig.CREATE_GROUP_CONFIG,
                desc: '',
                groupname,
                members: pageData.friendIds,
                inviteNeedConfirm,
            },
            success: (res) => {
                console.log('res -->', res)
            },
        })
        console.log('result -->', result)
        if (result.data) {
            chatListStore.groupList.push({
                groupid: result.data.groupid,
                groupname,
                groupimg: Tools.getUrl('group-default.png'),
            })
            chatListStore.chatList.unshift({
                channel_id: result.data.groupid,
                himId: result.data.groupid,
                unread_num: 1,
                lastMessage: {
                    from: userStore.userId,
                    id: result.data.groupid,
                    payload: {
                        nickname: groupname,
                        sex: userStore.userInfo?.sex,
                        avatar: Tools.getDefaultAvatar(
                            userStore.userInfo?.sex === '2',
                            userStore.userInfo?.avatar
                        ),
                    },
                    msg: 'welcome',
                    type: 'txt',
                    chatType: 'groupchat',
                    timestamp: Date.now(),
                    to: result.data.groupid,
                },
            })

            console.log('chatListStore.chatList -->', chatListStore.chatList)
            chatStore.setchatData(result.data.groupid, 'groupChat')
            await chatStore.sendMessage(
                'txt',
                {
                    chatType: 'groupChat',
                    msg: 'welcome',
                    to: result.data.groupid,
                },
                {
                    chatType: 'groupChat',
                    id: '',
                    msg: 'welcome',
                    time: +new Date(),
                    type: 'txt',
                    to: result.data.groupid,
                },
                () => {
                    nextTick(() => {
                        chatListStore.getGroupList()
                    })
                }
            )
        }
    } catch (error) {
        showToast('创建群组失败，请稍候重试')
    } finally {
        closeCreateGroup()
    }
}

const goGroupChat = (id: string, name: string) => {
    chatStore.setchatData(id, 'groupChat')
    router.push({
        path: '/my-chat',
        query: {
            name,
        },
    })
}

const goChat = (data: EasemobChat.conversationList & { himId: string }) => {
    console.log('data -->', data)
    chatStore.setchatData(
        data.himId,
        CommonConfig.CHAT_TYPE[(data.lastMessage as any).chatType],
        'down'
    )

    friendStore.setFriend({
        avatar: data.lastMessage.payload.avatar,
        sex: data.lastMessage.payload.sex || '1',
        nickname: data.lastMessage.payload.nickname || data.himId,
        userid: data.himId,
        onLine: false,
    })

    router.push({
        path: '/my-chat',
        query: {
            name: data.lastMessage.payload.nickname || data.himId,
        },
    })
}

onActivated(() => {
    console.log('>>>>>>> cahtpage onActivated', EaseChatClient.isOpened())
    // methods.getChatList()
    if (EaseChatClient.isOpened()) {
        /** 获取会话列表 */
        chatListStore.getChatList().then(() => {
            /** 获取群组列表 */
            chatListStore.getGroupList()
        })
    }
})
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}
.chat {
    height: calc(100vh - 60rem);
    overflow: hidden;
}
.chat-list {
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
.group-list {
    display: flex;
    flex-direction: column;
    gap: 10rem;
    .group-item {
        display: flex;
        padding: 10rem 0 0;
        align-items: center;
        .left {
            flex: none;
            padding-left: 10rem;
            img {
                width: 40rem;
                display: block;
            }
        }
        .info {
            flex: 1;
            margin-left: 8rem;
            font-size: 15rem;
            max-width: 276rem;
        }
    }
}
.create-group {
    height: 100vh;
    width: 100vw;
    position: relative;
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
        max-height: calc(100vh - 150rem);
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .submit-friend {
        width: 100vw;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 60rem;
        background-color: #ddd;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .submit-btn {
            margin-right: 10rem;
            font-size: 16rem;
            padding: 8rem 12rem;
            background-color: #59ce61;
            border-radius: 5rem;
            color: #fff;
        }
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
main {
    max-height: calc(100vh - 155rem);
    overflow-y: scroll;
    overflow-x: hidden;
}
.section {
    margin-bottom: 10rem;
    .title {
        font-size: 17rem;
        font-weight: bold;
        padding: 10rem;
        border-bottom: 1rem solid #eee;
    }
}
.chat-search {
    width: 100vw;
    overflow: hidden;
    height: calc(100vh - 60rem);
    .header {
        display: flex;
        padding: 10rem;
        position: relative;
        img {
            width: 20rem;
            position: absolute;
            right: 60rem;
            top: 50%;
            transform: translate(0, -55%);
        }
        input {
            border: none;
            outline: none;
            height: 30rem;
            flex: 1;
            border-radius: 999rem;
            box-sizing: border-box;
            padding-left: 10rem;
            font-size: 14rem;
        }
        span {
            flex: none;
            font-size: 14rem;
            padding-left: 10rem;
            line-height: 32rem;
        }
    }
    .search-list {
        height: calc(100vh - 60rem);
        overflow-y: scroll;
        .chat-list-item {
            background-color: #fff;
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
}

:deep(.van-popover[data-popper-placement='bottom'] .van-popover__arrow) {
    right: 10rem;
}
:deep(.van-checkbox__label) {
    flex: 1;
}
</style>
