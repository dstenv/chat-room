<template>
    <div class="x-chat">
        <div class="x-chat-head">
            <img
                :src="tools.getUrl('back.png')"
                alt=""
                @click="router.back()"
            />
            <span>{{ nickname || '未知' }}</span>
            <img :src="tools.getUrl('many.png')" alt="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import tools from '@/utils/tools'

const route = useRoute()
const router = useRouter()

const { nickname, id } = route.query as {
    nickname: string
    id: string
}

const pageData = reactive({
    id: Number(id || ''),
})
</script>

<style scoped lang="scss">
.x-chat {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
.x-chat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rem;
    img {
        display: block;
        width: 20rem;
    }
    span {
        font-size: 14rem;
        font-weight: 500;
    }
}
</style>
