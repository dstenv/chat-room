<template>
    <div class="mail">
        <XHeader title="通讯录">
            <template #right>
                <img :src="Tool.getUrl('icon-add.png')" alt="" />
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
        </main>
    </div>
</template>

<script setup lang="ts">
import { getFriendList } from '@/apis/friend/getFriendList'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import Tool from '@/utils/tools'

interface MailTopItem {
    text: string
    icon: string
    bgColor: string
    action: () => void
}

const userStore = useUserStore()

const { userId } = storeToRefs(userStore)

const mailTopList: MailTopItem[] = [
    {
        icon: Tool.getUrl('icon-room.png'),
        text: '群聊',
        bgColor: '#78bd78',
        action() {},
    },
]

const pageData = reactive({
    users: [] as string[],
})

const init = async () => {
    try {
        const result = await getFriendList(
            `users/${userId.value}/contacts/users`
        )()
        pageData.users = result.data
    } catch (error) {}
}
init()
</script>

<style scoped lang="scss">
.mail {
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
main {
    .top-list {
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
}
</style>
