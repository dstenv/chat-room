<template>
    <div v-if="pageData.init">
        <XUser :user-info="pageData.userInfo" :other-info-list="[]">
            <template #oprate>
                <div class="add" @click="methods.agree">同意好友申请</div>
            </template>
        </XUser>
    </div>
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

            pageData.userInfo = {
                userid: pageData.userId,
                ...property.data,
            }
        } catch (error) {
        } finally {
            pageData.init = true
        }
    },
    agree() {},
}
methods.getUserInfo()
</script>

<style scoped lang="scss">
.add {
    background-color: #fff;
    font-size: 17rem;
    color: #5f6891;
    font-weight: bold;
    letter-spacing: 1rem;
    margin-top: 10rem;
    padding: 18rem 0;
    text-align: center;
}
</style>
