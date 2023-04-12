<template>
    <div
        class="friend-item"
        @click="
            () => {
                friendStore.setFriend({ ...props.info })

                router.push({
                    path: '/friend-detail',
                })
            }
        "
    >
        <div class="img">
            <img :src="props.info.avatar" alt="" />
        </div>
        <div class="name">{{ props.info.nickname || props.info.userid }}</div>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useFriendStore } from '@/stores/friend'
import type { UserProPertyType } from '@/types'

const router = useRouter()
const chatStore = useChatStore()
const friendStore = useFriendStore()

const props = defineProps<{
    info: UserProPertyType
    /** 是否可选择 */
    select?: boolean
}>()

onBeforeUnmount(() => {
    chatStore.setTargetId('')
})
</script>

<style scoped lang="scss">
.friend-item {
    padding-top: 10rem;
    display: flex;
    align-items: flex-start;
    transition: background 0.15s linear;
    .img {
        margin: 0 10rem;
        border-radius: 3rem;
        img {
            width: 35rem;
            border-radius: 3rem;
            display: block;
            vertical-align: top;
        }
    }
    .name {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: content-box;
        padding: 12rem 0 18rem;
        font-size: 14rem;
        border-bottom: 1rem solid #ddd;
        letter-spacing: 1rem;
        font-weight: 500;
    }
    &:active {
        background-color: #d5d5d5;
    }
}
</style>
