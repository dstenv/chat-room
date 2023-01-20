<template>
    <div class="main">
        <RouterView />
        <VanTabbar v-model="active" route>
            <VanTabbarItem
                v-for="(item, index) in tabbar"
                :key="index"
                :to="item.path"
            >
                <template #icon="props">
                    <img
                        :src="
                            props.active ? item.activeIcon : item.inActiveIcon
                        "
                    />
                    <span style="font-size: 14rem">{{ item.name }}</span>
                </template>
            </VanTabbarItem>
        </VanTabbar>
    </div>
</template>

<script setup lang="ts">
type RouterPath = 'chat' | 'mail-list' | 'wechat-moments' | 'my'

interface TabbarItem {
    name: string
    path: RouterPath
    // 激活icon
    activeIcon: string
    // 未激活icon
    inActiveIcon: string
}

const active = ref(0)

const tabbar: TabbarItem[] = [
    {
        name: '聊天',
        path: 'chat',
        activeIcon: '',
        inActiveIcon: '',
    },
    {
        name: '通讯录',
        path: 'mail-list',
        activeIcon: '',
        inActiveIcon: '',
    },
    {
        name: '朋友圈',
        path: 'wechat-moments',
        activeIcon: '',
        inActiveIcon: '',
    },
    {
        name: '我的',
        path: 'my',
        activeIcon: '',
        inActiveIcon: '',
    },
]
</script>

<style scoped lang="scss">
.main {
    width: 100vw;
    height: 100vh;
}
.van-tabbar {
    padding: 10rem 0;
    background-color: #fff;
    img {
        height: 42rem;
    }
}
</style>
