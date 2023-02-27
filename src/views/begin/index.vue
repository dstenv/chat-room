<template>
    <div class="begin">
        <div class="box" :style="{ transform: `translateX(${moveX}vw)` }">
            <div v-for="(item, index) in componentList" :key="index">
                <component :is="item.component">
                    <div
                        style="
                            margin-top: 15rem;
                            text-align: center;
                            font-size: 14rem;
                        "
                        @click="moveX = item.key === 'login' ? -100 : 0"
                    >
                        {{ item.msg }}
                        <span class="tip-color">{{ item.btnText }}</span>
                    </div>
                </component>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Register from './component/register.vue'
import Login from './component/login.vue'
import type { Component } from 'vue'

interface ComponentItem {
    component: Component
    msg: string
    btnText: '注册' | '登录'
    key: 'register' | 'login'
}

const moveX = ref(0)

const componentList: ComponentItem[] = [
    {
        btnText: '注册',
        msg: '暂无账号？',
        component: Login,
        key: 'login',
    },
    {
        btnText: '登录',
        msg: '已有账号？',
        component: Register,
        key: 'register',
    },
]
</script>

<style scoped lang="scss">
.begin {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .box {
        display: flex;
        width: 200vw;
        transition: all 0.5s cubic-bezier(0.57, -0.07, 0, 1.39);
        .login,
        .register {
            width: 100vw;
        }
    }
}
</style>
