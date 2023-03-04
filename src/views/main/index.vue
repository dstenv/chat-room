<template>
    <div class="main">
        <div>
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
        </div>

        <van-tabbar v-model="activeIndex" active-color="#59e062">
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
                                    ? Tool.getUrl(item.activeIcon)
                                    : Tool.getUrl(item.inActiveIcon)
                            "
                        />
                        <span style="font-size: 14rem">{{ item.name }}</span>
                    </div>
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup lang="ts">
import Tool from '@/utils/tools'

type RouterPath = 'chat' | 'mail-list' | 'wechat-moments' | 'my'

interface TabbarItem {
    name: string
    path: RouterPath
    // 激活icon
    activeIcon: string
    // 未激活icon
    inActiveIcon: string
}

const route = useRoute()

const activeIndex = ref(0)

const tabbar = ref<TabbarItem[]>([
    {
        name: '消息',
        path: 'chat',
        activeIcon: 'msg_active.png',
        inActiveIcon: 'msg_inactive.png',
    },
    {
        name: '通讯录',
        path: 'mail-list',
        activeIcon: 'mail_list_active.png',
        inActiveIcon: 'mail_list_inactive.png',
    },
    {
        name: '发现',
        path: 'wechat-moments',
        activeIcon: 'discover_active.png',
        inActiveIcon: 'discover_inactive.png',
    },
    {
        name: '我的',
        path: 'my',
        activeIcon: 'my_active.png',
        inActiveIcon: 'my_inactive.png',
    },
])
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
