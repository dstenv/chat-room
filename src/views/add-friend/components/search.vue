<template>
    <div class="search c-bg">
        <div class="head">
            <img
                :src="Tools.getUrl('search-gray.png')"
                alt=""
                @click="methods.search()"
            />
            <input
                type="text"
                enterkeyhint="search"
                autofocus
                ref="textRef"
                v-model="pageData.value"
                @input="methods.listenText"
                @keydown="methods.inputKeyDown"
            />
            <span @click="emits('cancel')">取消</span>
        </div>

        <main v-show="pageData.value && !pageData.notFind">
            <div class="search-tip" @click="methods.search">
                <div class="icon">
                    <img :src="Tools.getUrl('search-white.png')" alt="" />
                </div>
                <p class="text">
                    <span>搜索：</span>
                    <span>{{ pageData.value }}</span>
                </p>
            </div>
            aaa
        </main>

        <div class="not-find" v-show="pageData.value && pageData.notFind">
            该用户不存在
        </div>
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'
import { findUser } from '@/apis/user/findUser'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import { useChatListStore } from '@/stores/chatList'

export interface SearchInstance {
    focus: () => void
}

const emits = defineEmits(['cancel'])

const userStore = useUserStore()
const router = useRouter()
const chatListStore = useChatListStore()
const textRef = ref<HTMLInputElement>({} as HTMLInputElement)

const pageData = reactive({
    value: '',
    /** 是否没有查找到用户 */
    notFind: false,
    timer: null as null | number,
})

const methods = {
    inputKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            methods.search()
        }
    },
    async search() {
        console.log('search -->', pageData.value)

        if (!pageData.value.trim()) {
            showToast('请输入有效的用户id')
            return
        }
        /** 如果输入的是当前登录用户则不搜索 */
        if (pageData.value.trim() === userStore.userId) {
            showToast('您不能添加自己成为好友')
            return
        }
        /** 如果已存在好友则提示 */
        if (
            chatListStore.friendList.find(
                (item) =>
                    item.userid === pageData.value.trim() ||
                    item.nickname === pageData.value.trim()
            )
        ) {
            showToast('您已存在该好友')
            return
        }

        /** 获取用户信息，如果没有则说明没有这个用户 */
        try {
            const result = await findUser(pageData.value.trim())()

            console.log('search result -->', result)

            if (!result) {
                pageData.notFind = true
                return
            }

            router.push({
                path: '/search-user',
                query: {
                    id: result.entities[0].username,
                },
            })
        } catch (error) {}
    },

    listenText() {
        if (pageData.timer) {
            clearTimeout(pageData.timer)
        }

        pageData.timer = setTimeout(() => {
            if (!pageData.value.trim()) {
                pageData.notFind = false
            }

            clearTimeout(pageData.timer as number)
        }, 100)
    },
}

defineExpose({
    focus: () => textRef.value.focus(),
} as SearchInstance)
</script>

<style scoped lang="scss">
.search {
    height: 100vh;
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
    main {
        background-color: #fff;
        height: calc(100vh - 52rem);
    }
    .search-tip {
        padding: 10rem 15rem;
        display: flex;
        align-items: center;
        border-bottom: 1rem solid #ddd;
        .icon {
            background-color: #56be6e;
            padding: 10rem;
            border-radius: 5rem;
            img {
                width: 20rem;
                display: block;
            }
        }
        .text {
            padding-left: 10rem;
            & > span {
                &:first-of-type {
                    font-size: 16rem;
                    font-weight: 500;
                }
                &:last-of-type {
                    font-size: 14rem;
                    color: #56be6e;
                    font-weight: 500;
                }
            }
        }
    }
    .not-find {
        height: 100rem;
        text-align: center;
        line-height: 100rem;
        background-color: #fff;
        font-size: 15rem;
        color: #919191;
    }
}
</style>
