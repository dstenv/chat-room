<template>
    <XUser v-if="pageData.init" :user-info="pageData.userInfo" />
</template>

<script setup lang="ts">
import XUser from '@/components/XUser/index.vue'
import { getUserInfo } from '@/apis/user/getUserInfo'
import type { UserProPertyType } from '@/types'

const route = useRoute()

const pageData = reactive({
    userId: (route.query.id as string) || '',
    userInfo: {} as UserProPertyType,
    init: false,
})

const methods = {
    async getUserInfo() {
        try {
            const property = await getUserInfo(pageData.userId)()

            pageData.userInfo = property.data
        } catch (error) {
        } finally {
            pageData.init = true
        }
    },
}
methods.getUserInfo()
</script>

<style scoped></style>
