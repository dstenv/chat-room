<template>
    <div>朋友圈列表</div>
</template>

<script setup lang="ts">
import type { MessageData } from '@/types/message'

const props = defineProps<{
    list: MessageData[]
}>()
</script>

<style scoped></style>
