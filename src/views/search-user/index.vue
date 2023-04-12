<template>
    <div v-if="pageData.init">
        <XUser :user-info="pageData.userInfo" :otherInfoList="otherInfoList" />
    </div>
</template>

<script setup lang="tsx">
import XUser from '@/components/XUser/index.vue'
import type { OtherInfoItemType } from '@/components/XOprateItem/index.vue'
import { getUserInfo } from '@/apis/user/getUserInfo'
import type { UserProPertyType } from '@/types'

const route = useRoute()

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
}
methods.getUserInfo()
</script>

<style scoped></style>
