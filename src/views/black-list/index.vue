<template>
    <div class="black-list">
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
                <XSearch tip-text="用户id/昵称" @click="() => {}" />
            </template>
        </XHeader>

        <template v-if="showList.length > 0">
            <div>
                <Item
                    v-for="item in showList"
                    :key="item.id"
                    :info="item"
                    @click="click"
                />
            </div>
        </template>

        <template v-else>
            <XEmpty :img="Tools.getUrl('chat-empty.png', 'imgs')" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'
import Item from './components/item.vue'
import XHeader from '@/components/XHeader/index.vue'
import XSearch from '@/components/XSearch/index.vue'
import { useChatListStore } from '@/stores/chatList'
import XEmpty from '@/components/XEmpty/index.vue'

const router = useRouter()
const chatListStore = useChatListStore()

const keywords = ref('')

const showList = computed(() =>
    chatListStore.blackList.filter((item) =>
        keywords.value.trim()
            ? [item.id, item.nickname].includes(keywords.value)
            : true
    )
)

const init = async () => {
    chatListStore.getBlackFriendList()
}
init()

const click = () => {}
</script>

<style scoped lang="scss">
.black-list {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
