<template>
    <div>
        <XOprateItem
            v-for="item in list"
            :key="item.text"
            :text="item.text"
            :border="item.border"
            :click="item.click"
        />
    </div>
</template>

<script setup lang="ts">
import type { OtherInfoItemType } from '@/components/XOprateItem/index.vue'
import XOprateItem from '@/components/XOprateItem/index.vue'
import { useChatStore } from '@/stores/chat'
import { useChatListStore } from '@/stores/chatList'

const chatListStore = useChatListStore()
const chatStore = useChatStore()
const router = useRouter()

const list: OtherInfoItemType[] = [
    {
        text: '朋友圈',
        async click() {
            await chatListStore.getMoment(false)
            if (!chatListStore.momentGroup.groupid) {
                chatStore.setchatData('', 'groupChat', 'down', 50)
            } else {
                chatStore.setchatData(
                    chatListStore.momentGroup.groupid,
                    'groupChat',
                    'down',
                    50
                )
            }
            router.push('/moments')
        },
        border: true,
    },
]
</script>

<style scoped></style>
