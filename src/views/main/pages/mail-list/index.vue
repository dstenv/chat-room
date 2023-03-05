<template>
    <div>通讯录</div>
</template>

<script setup lang="ts">
import { getFriendList } from '@/apis/friend/getFriendList'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

const { userId } = storeToRefs(userStore)

const init = async () => {
    try {
        const result = await getFriendList(
            `users/${userId.value}/contacts/users`
        )()
        console.log(result, 'result')
    } catch (error) {}
}
init()
</script>

<style scoped></style>
