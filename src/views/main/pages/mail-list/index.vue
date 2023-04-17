<template>
    <div class="mail">
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
                <XSearch />
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
                            v-if="item.prefix && item.prefix.show"
                            :style="{
                                ...(item.prefix.style || {}),
                            }"
                        >
                            {{ item.prefix.text }}
                        </div>
                        <img :src="item.icon" alt="" />
                    </div>
                    <div class="top-text">{{ item.text }}</div>
                </div>
            </div>

            <div class="friend-list" v-if="chatListStore.friendList.length > 0">
                <XFriend
                    v-for="item in chatListStore.friendList"
                    :key="item.userid"
                    :info="item"
                />
                aaa
            </div>

            <template v-else>
                <XEmpty :img="Tools.getUrl('chat-empty.png', 'imgs')" />
            </template>
        </main>
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'
import XFriend from '@/components/XFriend/index.vue'
import XSearch from '@/components/XSearch/index.vue'
import { useChatListStore } from '@/stores/chatList'
import XEmpty from '@/components/XEmpty/index.vue'
import { EaseChatClient } from '@/utils/config'

interface MailTopItem {
    text: string
    icon: string
    bgColor: string
    action: () => void
    prefix?: {
        show: boolean
        text: string | number
        style?: Object
    }
}

const chatListStore = useChatListStore()
const router = useRouter()

const mailTopList: MailTopItem[] = [
    {
        icon: Tools.getUrl('icon-room.png'),
        text: '群聊',
        bgColor: '#78bd78',
        action() {},
    },
    {
        icon: Tools.getUrl('add-friend.png'),
        text: '新的朋友',
        bgColor: '#eda054',
        action() {
            router.push('/new-friend')
        },
        prefix: {
            show:
                chatListStore.newFriends.filter((item) => !item.read).length !==
                0,
            text: chatListStore.newFriends.filter((item) => !item.read).length,
            style: {},
        },
    },
    {
        icon: Tools.getUrl('blacklist.png'),
        text: '黑名单',
        bgColor: 'rgb(50,50,50)',
        action() {
            router.push('/black-list')
        },
    },
]

const pageData = reactive({})

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
</style>
