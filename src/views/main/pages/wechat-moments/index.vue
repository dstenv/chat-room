<template>
    <div>
        <XOprateItem
            v-for="item in list"
            :key="item.text"
            :text="item.text"
            :border="item.border"
        />
    </div>
</template>

<script setup lang="ts">
import type { OtherInfoItemType } from '@/components/XOprateItem/index.vue'
import XOprateItem from '@/components/XOprateItem/index.vue'

const list: OtherInfoItemType[] = [
    {
        text: '朋友圈',
        click() {},
        border: true,
    },
]
</script>

<style scoped></style>
