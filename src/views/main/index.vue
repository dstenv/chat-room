<template>
    <div class="main">
        <RouterView v-slot="{ Component }">
            <KeepAlive>
                <component
                    :is="Component"
                    :key="route.name"
                    v-if="route.meta.keep"
                />
            </KeepAlive>
            <component
                :is="Component"
                :key="route.name"
                v-if="!route.meta.keep"
            />
        </RouterView>

        <van-tabbar v-model="activeIndex" active-color="#59e062" fixed>
            <van-tabbar-item
                v-for="(item, index) in tabbar"
                :key="index"
                :to="item.path"
            >
                <template #icon="props">
                    <div style="text-align: center">
                        <img
                            :src="
                                props.active
                                    ? Tools.getUrl(item.activeIcon)
                                    : Tools.getUrl(item.inActiveIcon)
                            "
                        />
                        <span style="font-size: 14rem">{{ item.text }}</span>
                    </div>
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'

const RouteItem = {
    'chat': 'CHAT',
    'mail-list': 'MAIL-LIST',
    'wechat-moments': 'WECHAT-MOMENTS',
    'my': 'MY',
}

interface TabbarItem<T> {
    name: T[keyof T]
    text: string
    path: keyof T
    // 激活icon
    activeIcon: string
    // 未激活icon
    inActiveIcon: string
}

const route = useRoute()

const activeIndex = ref(0)

const tabbar = ref<TabbarItem<typeof RouteItem>[]>([
    {
        text: '消息',
        name: 'CHAT',
        path: 'chat',
        activeIcon: 'msg_active.png',
        inActiveIcon: 'msg_inactive.png',
    },
    {
        text: '通讯录',
        name: 'MAIL-LIST',
        path: 'mail-list',
        activeIcon: 'mail_list_active.png',
        inActiveIcon: 'mail_list_inactive.png',
    },
    {
        text: '发现',
        name: 'WECHAT-MOMENTS',
        path: 'wechat-moments',
        activeIcon: 'discover_active.png',
        inActiveIcon: 'discover_inactive.png',
    },
    {
        text: '我的',
        name: 'MY',
        path: 'my',
        activeIcon: 'my_active.png',
        inActiveIcon: 'my_inactive.png',
    },
])

const init = async () => {
    for (let i = 0; i < tabbar.value.length; i++) {
        if (tabbar.value[i].name === route.name) {
            activeIndex.value = i
            break
        }
    }
}

init()
</script>

<style scoped lang="scss">
.main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    // 禁用拖动
    touch-action: none;
}
.van-tabbar {
    background-color: #fff;
    padding-top: 10rem;
    img {
        display: block;
        margin: 0 auto;
        height: 22rem;
    }
}
.van-tabbar--fixed {
    // bottom: 18rem;
}
</style>
