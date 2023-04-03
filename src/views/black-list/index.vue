<template>
    <div>黑名单</div>
</template>

<script setup lang="ts">
import { getBlackList } from '@/apis/user/getBlackList'
import { getUserInfo } from '@/apis/user/getUserInfo'
import { Tools } from '@/utils/tools'

interface BlackListItem {
    id: string
    nickname: string
    avatar: string
}

const blackList = ref<BlackListItem[]>([])

const init = async () => {
    try {
        const result = await getBlackList()

        for (let i = 0; i < result.data.length; i++) {
            const property = await getUserInfo(result.data[i])()

            console.log('property -->', property)
            blackList.value.push({
                id: result.data[i],
                nickname: property.data.nickname || '',
                avatar:
                    property.data.avatar ||
                    Tools.getUrl(
                        property.data.sex === '2'
                            ? 'avatar-default-uwoman.png.png'
                            : 'avatar-default-uman.png.png'
                    ),
            })
        }
    } catch (error) {
        console.log('getBlackList error -->', error)
    }
}
init()
</script>

<style scoped></style>
