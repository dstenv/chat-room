<template>
    <div class="new-friend c-bg">
        <XHeader
            title="新的朋友"
            :left-icon="Tools.getUrl('back.png')"
            :leftClick="
                () => {
                    router.back()
                }
            "
        >
            <template #right>
                <span
                    class="add"
                    @click="
                        () => {
                            router.push('/add-friend')
                        }
                    "
                    >添加朋友</span
                >
            </template>

            <template #custom>
                <XSearch tip-text="账号/手机号" @click="() => {}" />
            </template>
        </XHeader>

        <main>
            <div
                class="new-friend-list"
                v-if="chatListStore.newFriends.length > 0"
            >
                <div
                    class="item"
                    v-for="item in chatListStore.newFriends"
                    :key="item.from"
                    @click="
                        () => {
                            router.push({
                                path: '/accept-friend',
                                query: {
                                    id: item.from,
                                },
                            })
                        }
                    "
                >
                    <div class="left">
                        <img
                            :src="
                                item.avatar ||
                                Tools.getUrl('avatar-default-uman.png.png')
                            "
                            alt=""
                        />
                    </div>
                    <div
                        class="center"
                        :style="{
                            maxWidth: item.agree ? '274rem' : '256rem',
                        }"
                    >
                        <p>{{ item.nickname || item.from }}</p>
                        <span>{{
                            item.from === userStore.userId
                                ? `我：${item.text}`
                                : item.text
                        }}</span>
                    </div>
                    <div class="right">
                        <span
                            class="no-agree"
                            @click.stop="methods.agree(item)"
                            v-if="!item.agree"
                            >同意</span
                        >
                        <span v-else>已添加</span>
                    </div>
                </div>
            </div>

            <template v-else> 空状态组件 </template>
        </main>
    </div>
</template>

<script setup lang="ts">
import XHeader from '@/components/XHeader/index.vue'
import XSearch from '@/components/XSearch/index.vue'
import { useChatListStore } from '@/stores/chatList'
import { useUserStore } from '@/stores/user'
import { EaseChatClient } from '@/utils/config'
import { Tools } from '@/utils/tools'
import { showSuccessToast } from 'vant'
import type { NewFriend } from '@/types'

const router = useRouter()
const chatListStore = useChatListStore()
const userStore = useUserStore()

const methods = {
    agree(data: NewFriend) {
        EaseChatClient.acceptContactInvite(data.from)

        showSuccessToast({
            message: '添加成功',
        })

        setTimeout(() => {
            const find = chatListStore.newFriends.find(
                (friend) => friend.from === data.from
            )

            if (find) {
                find.agree = true
            }

            chatListStore.friendList.push({
                userid: data.from,
                sex: data.sex || '1',
                avatar: data.avatar,
                nickname: data.nickname,
            })
            chatListStore.deleteManyFriend()

            router.back()
        }, 400)
    },
}
chatListStore.newFriends = chatListStore.newFriends.map((friend) => ({
    ...friend,
    read: true,
}))
</script>

<style scoped lang="scss">
.new-friend {
    height: 100vh;
    .add {
        font-size: 14rem;
        font-weight: 400;
    }
    .new-friend-list {
        background-color: #fff;
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10rem 0;
            margin: 0 15rem;
            border-bottom: 1rem solid #e7e7e7;
            .left,
            .right {
                flex: none;
            }
            .left {
                img {
                    width: 35rem;
                    display: block;
                }
            }
            .right {
                .no-agree {
                    padding: 6rem 13rem;
                    border-radius: 4rem;
                    color: #fff;
                    background-color: #59ce61;
                    font-size: 14rem;
                }
            }
            .center {
                flex: 1;
                padding: 0 10rem;
                p,
                span {
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                p {
                    font-size: 15rem;
                    font-weight: 500;
                    margin-bottom: 5rem;
                }
                span {
                    color: #868686;
                }
            }
        }
    }
}
</style>
