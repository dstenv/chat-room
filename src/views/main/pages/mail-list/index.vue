<template>
    <div>
        <div class="mail" v-if="!pageData.isSearch">
            <XHeader title="通讯录">
                <template #right>
                    <img
                        :src="Tools.getUrl('icon-add.png')"
                        alt=""
                        @click="
                            () => {
                                router.push('/add-friend')
                            }
                        "
                    />
                </template>
                <template #custom>
                    <XSearch @click="() => (pageData.isSearch = true)" />
                </template>
            </XHeader>

            <main>
                <div class="top-list">
                    <div
                        class="top-item"
                        v-for="(item, index) in mailTopList"
                        :key="index"
                        @click="item.action"
                    >
                        <div
                            class="top-img"
                            :style="{ backgroundColor: item.bgColor }"
                        >
                            <div
                                class="red-point"
                                v-if="
                                    showRed[item.key] && showRed[item.key].show
                                "
                                :style="{
                                    ...(showRed[item.key].style || {}),
                                }"
                            >
                                {{ showRed[item.key].content }}
                            </div>
                            <img :src="item.icon" alt="" />
                        </div>
                        <div class="top-text">{{ item.text }}</div>
                    </div>
                </div>

                <div class="friend-list" v-if="showList.length > 0">
                    <XFriend
                        v-for="item in showList"
                        :key="item.userid"
                        :info="item"
                    />
                </div>

                <template v-else>
                    <XEmpty :img="Tools.getUrl('chat-empty.png', 'imgs')" />
                </template>
            </main>
        </div>

        <div class="mail-search c-bg" v-else>
            <div class="head">
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
                <selectFriend
                    class="item"
                    v-for="item in showSearchList"
                    :key="item.userid"
                    :info="item"
                    @handleClick="
                        () => {
                            friendStore.setFriend({ ...item })

                            router.push({
                                path: '/friend-detail',
                            })
                        }
                    "
                />
            </div>

            <div v-show="showSearchList.length === 0">
                <XEmpty :img="Tools.getUrl('chat-empty.png', 'imgs')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'
import XFriend from '@/components/XFriend/index.vue'
import XSearch from '@/components/XSearch/index.vue'
import { useChatListStore } from '@/stores/chatList'
import XEmpty from '@/components/XEmpty/index.vue'
import { EaseChatClient } from '@/utils/config'
import selectFriend from '../chat/components/select-friend.vue'
import { useFriendStore } from '@/stores/friend'

interface MailTopItem {
    text: string
    icon: string
    key: string
    bgColor: string
    action: () => void
}

const chatListStore = useChatListStore()
const router = useRouter()
const friendStore = useFriendStore()

const mailTopList: MailTopItem[] = [
    {
        icon: Tools.getUrl('icon-room.png'),
        text: '群聊',
        key: 'group',
        bgColor: '#78bd78',
        action() {},
    },
    {
        icon: Tools.getUrl('add-friend.png'),
        text: '新的朋友',
        key: 'new',
        bgColor: '#eda054',
        action() {
            router.push('/new-friend')
        },
    },
    {
        icon: Tools.getUrl('blacklist.png'),
        text: '黑名单',
        key: 'black',
        bgColor: 'rgb(50,50,50)',
        action() {
            router.push('/black-list')
        },
    },
]

const showRed = computed(
    (): Record<
        string,
        {
            show: boolean
            content: string | number
            style?: Object
        }
    > => ({
        new: {
            show:
                chatListStore.newFriends.filter((item) => !item.agree)
                    .length !== 0,
            content: chatListStore.newFriends.filter((item) => !item.agree)
                .length,
            style: {},
        },
    })
)

const showList = computed(() => {
    const list = []
    for (let i = 0; i < chatListStore.friendList.length; i++) {
        if (
            !chatListStore.blackList.find(
                (item) => item.id === chatListStore.friendList[i].userid
            )
        ) {
            list.push({
                ...chatListStore.friendList[i],
            })
        }
    }
    return list
})

const showSearchList = computed(() => {
    if (!pageData.searchValue.trim()) return []

    console.log('showList.value -->', showList.value)

    return showList.value.filter((item) => {
        const arr = [item.userid, item.nickname]

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
    isSearch: false,
    searchValue: '',
})

const init = () => {
    chatListStore.getFriends()
}
init()
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}
.mail {
    height: calc(100vh - 60rem);
    background-color: #ededed;
}
main {
    height: calc(100vh - 60rem - 92rem);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    .top-list {
        background-color: #fff;
        .top-item {
            padding: 10rem 0 0;
            display: flex;
            align-items: flex-start;
            .top-img {
                margin: 0 10rem;
                padding: 6rem;
                border-radius: 3rem;
                position: relative;
                .red-point {
                    width: 15rem;
                    height: 15rem;
                    border-radius: 50%;
                    background-color: red;
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translate(50%, -50%);
                    text-align: center;
                    line-height: 15rem;
                    color: #fff;
                }
                img {
                    width: 23rem;
                    border-radius: 3rem;
                    display: block;
                    vertical-align: top;
                }
            }
            .top-text {
                box-sizing: content-box;
                flex-grow: 1;
                padding: 9rem 0 15rem;
                font-size: 14rem;
                border-bottom: 1rem solid #ddd;
                letter-spacing: 1rem;
                font-weight: 500;
            }
            &:active {
                background-color: #d5d5d5;
            }
        }
    }
    .friend-list {
        background-color: #fff;
    }
}
.mail-search {
    width: 100vw;
    overflow: hidden;
    height: calc(100vh - 60rem);
    .head {
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
        .item {
            background-color: #fff;
        }
    }
}
</style>
