<template>
    <div class="chat">
        <XHeader title="消息" :leftIcon="Tool.getUrl('search-gray.png')">
            <template #right>
                <VanPopover
                    v-model:show="pageData.showAddList"
                    placement="bottom-end"
                    theme="dark"
                    :offset="[14, 10]"
                >
                    <div class="add-list">
                        <div
                            class="add-item"
                            v-for="(item, index) in addList"
                            :key="index"
                            @click="
                                () => {
                                    pageData.showAddList = false
                                    item.action && item.action()
                                }
                            "
                        >
                            <img :src="item.icon" alt="" />
                            <span>{{ item.text }}</span>
                        </div>
                    </div>

                    <template #reference>
                        <img
                            class="add-friend-img"
                            :src="Tool.getUrl('add-gray.png')"
                            alt=""
                        />
                    </template>
                </VanPopover>
            </template>
        </XHeader>
    </div>
</template>

<script setup lang="ts">
import { EaseChatClient } from '@/utils/config'
import { showToast } from 'vant'
import Tool from '@/utils/tools'
interface AddListItem {
    text: string
    icon: string
    action?: () => void
}

const addList: AddListItem[] = [
    {
        text: '发起群聊',
        icon: Tool.getUrl('icon-room.png'),
        action() {
            console.log('发起群聊', 'desc')
        },
    },
    {
        text: '添加朋友',
        icon: Tool.getUrl('icon-add-user.png'),
        action() {
            console.log('添加朋友', 'desc')
        },
    },
    {
        text: '扫一扫',
        icon: Tool.getUrl('icon-sweep.png'),
        action() {
            console.log('扫一扫', 'desc')
        },
    },
    {
        text: '收付款',
        icon: Tool.getUrl('icon-money.png'),
        action() {
            console.log('收付款', 'desc')
        },
    },
]

const pageData = reactive({
    showAddList: false,
})

EaseChatClient.addEventHandler('chatConnect', {
    onDisconnected: () => {
        showToast('已断线')
    },
})
</script>

<style scoped lang="scss">
.chat {
    overflow: hidden;
}
.add-friend-img {
    width: 100%;
}
.add-list {
    padding: 5rem 10rem;
    .add-item {
        white-space: nowrap;
        padding: 10rem;
        display: flex;
        align-items: center;
        font-size: 14rem;
        border-bottom: 1rem solid #5c5c5c;
        img {
            width: 18rem;
            outline: none;
            vertical-align: baseline;
            margin-right: 8rem;
        }
        &:last-of-type {
            border-bottom: 0rem solid transparent;
        }
    }
}
:deep(.van-popover[data-popper-placement='bottom'] .van-popover__arrow) {
    right: 10rem;
}
</style>
