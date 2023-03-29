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
                >
                    <div
                        class="top-img"
                        :style="{ backgroundColor: item.bgColor }"
                    >
                        <img :src="item.icon" alt="" />
                    </div>
                    <div class="top-text">{{ item.text }}</div>
                </div>
            </div>

            <div class="friend-list">
                <XFriend
                    v-for="item in chatListStore.friendList"
                    :key="item.userid"
                    :info="item"
                />
                aaa
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'
import XFriend from '@/components/XFriend/index.vue'
import XSearch from '@/components/XSearch/index.vue'
import { useChatListStore } from '@/stores/chatList'

interface MailTopItem {
    text: string
    icon: string
    bgColor: string
    action: () => void
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
]

const pageData = reactive({})

const init = async () => {
    chatListStore.getFriends()
}

// onActivated(() => {
//     console.log('>>>>>> 通讯录页面 onActivated')
//     emits('setTabbar')
// })
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
    .top-list {
        background-color: #fff;
        .top-item {
            padding: 10rem 0;
            display: flex;
            align-items: flex-start;
            .top-img {
                margin: 0 10rem;
                padding: 6rem;
                border-radius: 3rem;
                img {
                    width: 20rem;
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
        }
    }
    .friend-list {
        background-color: #fff;
    }
}
</style>
