<template>
    <div class="friend-item">
        <div class="img">
            <img :src="props.info.avatar" alt="" />
        </div>
        <div class="name">{{ props.info.nickname || props.info.userid }}</div>
    </div>
</template>

<script setup lang="ts">
import type { UserProPertyType } from '@/types'

const props = defineProps<{
    info: UserProPertyType
}>()
</script>

<style scoped lang="scss">
.friend-item {
    padding-top: 10rem;
    display: flex;
    align-items: flex-start;
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
}
</style>
