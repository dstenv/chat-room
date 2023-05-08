<template>
    <div class="my c-bg">
        <div class="head">
            <div class="left">
                <img :src="showMyInfo.avatar" alt="" />
            </div>
            <div class="center">c</div>
            <div class="right">r</div>
        </div>

        <div class="button" @click="clear">清除token</div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { Tools } from '@/utils/tools'

const userStore = useUserStore()

const showMyInfo = computed(() => ({
    id: userStore.userInfo?.userid || userStore.userId,
    avatar:
        userStore.userInfo?.area ||
        Tools.getDefaultAvatar(
            userStore.userInfo?.sex === '2',
            userStore.userInfo?.avatar
        ),
    nickname: userStore.userInfo?.nickname || userStore.userId,
}))

const clear = () => {
    localStorage.setItem('userToken', '')
    console.log('token -->', localStorage.getItem('userToken'))
}
</script>

<style scoped lang="scss">
.my {
    height: calc(100vh - 60rem);
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 50rem 15rem 15rem;
        background-color: #fff;
        .left {
            img {
                width: 80rem;
                display: block;
            }
        }
    }

    .button {
        font-size: 18rem;
    }
}
</style>
