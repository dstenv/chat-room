<template>
    <div v-if="friendInfo.friend">
        <XUser :user-info="friendInfo.friend" :otherInfoList="otherInfoList">
            <template #oprate> a </template>
        </XUser>
    </div>
</template>

<script setup lang="tsx">
import XUser from '@/components/XUser/index.vue'
import type { OtherInfoItemType } from '@/components/XUser/components/other-item.vue'
import { useFriendStore } from '@/stores/friend'

const friendInfo = useFriendStore()

const otherInfoList: OtherInfoItemType[] = [
    {
        text: '个性签名',
        border: true,
        render() {
            return <div>暂无个性签名</div>
        },
    },
    {
        text: '朋友圈',
        border: true,
    },
    {
        text: '视频号',
    },
]
</script>

<style scoped></style>
