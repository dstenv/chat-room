<template>
    <div>
        <div class="black-list" v-if="!pageData.isSearch">
            <XHeader
                title="黑名单"
                :left-icon="Tools.getUrl('back.png')"
                :leftClick="
                    () => {
                        router.back()
                    }
                "
            >
                <template #custom>
                    <XSearch
                        tip-text="用户id/昵称"
                        @click="
                            () => {
                                pageData.isSearch = true
                            }
                        "
                    />
                </template>
            </XHeader>

            <template v-if="showList.length > 0">
                <div>
                    <Item
                        v-for="item in showList"
                        :key="item.id"
                        :info="item"
                        @click="click(item)"
                    />
                </div>
            </template>

            <template v-else>
                <XEmpty :img="Tools.getUrl('chat-empty.png', 'imgs')" />
            </template>
        </div>

        <div class="black-search c-bg" v-else>
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

            <div class="search-list">
                <Item
                    v-for="item in showSearchList"
                    :key="item.id"
                    :info="item"
                    @click="click(item)"
                    style="background-color: #fff"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'
import Item from './components/item.vue'
import XHeader from '@/components/XHeader/index.vue'
import XSearch from '@/components/XSearch/index.vue'
import { useChatListStore } from '@/stores/chatList'
import XEmpty from '@/components/XEmpty/index.vue'
import { useFriendStore } from '@/stores/friend'
import type { BlackListItem } from '@/types'

const router = useRouter()
const chatListStore = useChatListStore()
const friendStore = useFriendStore()

const showList = computed(() => chatListStore.blackList)

const showSearchList = computed(() => {
    if (!pageData.searchValue.trim()) return []

    console.log('showList.value -->', showList.value)

    return showList.value.filter((item) => {
        const arr = [item.id, item.nickname]

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

const init = async () => {
    chatListStore.getBlackFriendList()
}
init()

const click = (data: BlackListItem) => {
    friendStore.setFriend({
        userid: data.id,
        onLine: false,
        sex: '1',
        nickname: data.nickname,
        avatar: data.avatar,
    })

    router.push({
        path: '/friend-detail',
    })
}
</script>

<style scoped lang="scss">
.black-list {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.black-search {
    width: 100vw;
    overflow: hidden;
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
    .search-list {
        height: 100vh;
        overflow-y: scroll;
        .item {
            background-color: #fff;
        }
    }
}
</style>
