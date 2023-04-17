<template>
    <div class="x-group-chat">
        <XHeader
            :title="pageData.title"
            :left-icon="Tools.getUrl('back.png')"
            :left-click="
                () => {
                    router.back()
                }
            "
        />

        <main />
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'
import XHeader from '../XHeader/index.vue'

const route = useRoute()
const router = useRouter()

const { name } = route.query as {
    name: string
}

const pageData = reactive({
    title: name,
})
</script>

<style scoped lang="scss">
.x-group-chat {
}
</style>
