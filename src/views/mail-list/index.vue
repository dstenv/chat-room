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

            <div class="friend-list">
                <XFriend
                    v-for="item in pageData.friends"
                    :key="item.userid"
                    :info="item"
                />
                aaa
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { getFriendList } from '@/apis/friend/getFriendList'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import Tool from '@/utils/tools'
import { getUserInfo } from '@/apis/user/getUserInfo'
import type { UserProPertyType } from '@/types'
import XFriend from '@/components/XFriend/index.vue'

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
    /** 用户好友列表 */
    friends: [] as UserProPertyType[],
})

const init = async () => {
    try {
        const result = await getFriendList(
            `users/${userId.value}/contacts/users`
        )()

        for (let i = 0; i < result.data.length; i++) {
            const property = await getUserInfo(result.data[i])()
            pageData.friends.push({
                userid: result.data[i],
                nickname: property.data.nickname || result.data[i],
                sex: property.data.sex,
                avatar:
                    property.data.avatar ||
                    Tool.getUrl(
                        property.data.sex === '2'
                            ? 'avatar-default-woman.png'
                            : 'avatar-default-man.png'
                    ),
            })
        }
    } catch (error) {}
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
