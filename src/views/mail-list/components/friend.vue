<template>
    <div
        class="friend-item"
        @click="
            () => {
                router.push({
                    path: '/my-chat',
                    query: {
                        id: props.info.userid,
                        nickname: props.info.nickname,
                    },
                })
            }
        "
    >
        <div class="img">
            <img :src="info.avatar" alt="" />
        </div>
        <div class="name">{{ props.info.nickname }}</div>
    </div>
</template>

<script setup lang="ts">
import type { UserProPertyType } from '@/types'

const router = useRouter()

const props = defineProps<{
    info: UserProPertyType
}>()
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
            width: 32rem;
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
        padding: 9rem 0 15rem;
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
