<template>
    <div>用户信息</div>
</template>

<script setup lang="ts">
import type { UserProPertyType } from '@/types'

const props = defineProps<{
    userInfo: UserProPertyType
}>()
</script>

<style scoped></style>
