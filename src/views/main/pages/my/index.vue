<template>
    <div class="my c-bg">
        <div
            class="head"
            @click="
                () => {
                    router.push('/my-info')
                }
            "
        >
            <div class="left">
                <img
                    :src="
                        Tools.getDefaultAvatar(
                            userStore.userInfo?.sex === '2',
                            userStore.userInfo?.avatar
                        )
                    "
                    alt=""
                />
            </div>
            <div class="center">
                <p>
                    {{ userStore.userInfo?.nickname || userStore.userId }}
                </p>
                <span>用户id：{{ userStore.userId }}</span>
            </div>
            <div class="right">
                <img :src="Tools.getUrl('back.png')" alt="" />
            </div>
        </div>

        <main>
            <div
                class="oprate-item"
                v-for="item in oprateList"
                :key="item.text"
                @click="item.action"
            >
                {{ item.text }}
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/apis/user/getUserInfo'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { Tools } from '@/utils/tools'
import { showConfirmDialog, showLoadingToast } from 'vant'
import type { ToastWrapperInstance } from 'vant/lib/toast/types'

interface OprateItem {
    text: string
    action: () => void
}

const userStore = useUserStore()
const router = useRouter()
const chatStore = useChatStore()

const oprateList: OprateItem[] = [
    {
        text: '退出登录',
        action: () => {
            showConfirmDialog({
                title: '提示',
                message: '是否退出当前账号?',
                confirmButtonText: '是',
                cancelButtonText: '否',
            })
                .then(() => {
                    let loading: null | ToastWrapperInstance = showLoadingToast(
                        {
                            message: '正在退出，请稍候',
                            forbidClick: true,
                            duration: 0,
                        }
                    )

                    localStorage.clear()
                    sessionStorage.clear()
                    chatStore.clear()
                    loading.close()

                    loading = null

                    nextTick(async () => {
                        await router.replace('/begin')
                        location.reload()
                    })
                })
                .catch(() => {})
        },
    },
]

const init = async () => {
    try {
        const result = await getUserInfo(userStore.userId)()
        userStore.setUserInfo(result.data)
    } catch (error) {}
}
init()
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}
.my {
    height: calc(100vh - 60rem);
    overflow-y: scroll;
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 50rem 15rem 15rem;
        background-color: #fff;
        .left {
            flex: none;
            img {
                width: 60rem;
                display: block;
            }
        }
        .center {
            flex: 1;
            padding-left: 10rem;
            font-size: 14rem;
            color: #5c5c5c;
            p {
                font-size: 17rem;
                font-weight: bold;
                padding-bottom: 10rem;
            }
        }
        .right {
            flex: none;
            img {
                display: block;
                transform: rotate(180deg);
                width: 20rem;
            }
        }
    }

    main {
        margin-top: 10rem;
        overflow: hidden;
        .oprate-item {
            padding: 15rem;
            font-size: 14rem;
            background-color: #fff;
            margin-bottom: 10rem;
            text-align: center;
        }
    }
}
</style>
