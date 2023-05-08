<template>
    <VanSwipeCell :before-close="close">
        <div class="friend-item" @click.stop="emits('click')">
            <div class="img">
                <img :src="props.info.avatar" alt="" />
            </div>
            <div class="name">{{ props.info.nickname || props.info.id }}</div>
        </div>
        <template #right>
            <VanButton square type="danger">移除</VanButton>
        </template>
    </VanSwipeCell>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import type { BlackListItem } from '@/types'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { removeBlackList } from '@/apis/friend/removeBlackList'
import { useChatListStore } from '@/stores/chatList'

const chatStore = useChatStore()
const chatListStore = useChatListStore()

const props = defineProps<{
    info: BlackListItem
}>()

const emits = defineEmits(['click'])

const close = ({
    position,
}: {
    position: 'left' | 'right' | 'cell' | 'outside'
}) => {
    if (position === 'right') {
        showConfirmDialog({
            title: '提示',
            message: '是否确定将此人移出黑名单？',
        })
            .then(async () => {
                console.log('移出')
                try {
                    const result = await removeBlackList(props.info.id)()

                    if (result.entities.length === 1) {
                        chatListStore.deleteBlack(result.entities[0].username)
                    } else {
                        for (let i = 0; i < result.entities.length; i++) {
                            chatListStore.deleteBlack(
                                result.entities[i].username
                            )
                        }
                    }
                } catch (error) {
                    showFailToast({
                        message: '移出黑名单失败',
                    })
                }
                showSuccessToast({
                    message: '移出黑名单成功',
                })
            })
            .catch(() => {})
        return false
    }
    return true
}

// onBeforeUnmount(() => {
//     chatStore.setTargetId('')
// })
</script>

<style scoped lang="scss">
.friend-item {
    padding-top: 10rem;
    display: flex;
    align-items: flex-start;
    transition: background 0.15s linear;
    .img {
        margin: 0 10rem;
        border-radius: 3rem;
        img {
            width: 35rem;
            border-radius: 3rem;
            display: block;
            vertical-align: top;
        }
    }
    .name {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: content-box;
        padding: 12rem 0 18rem;
        font-size: 14rem;
        border-bottom: 1rem solid #ddd;
        letter-spacing: 1rem;
        font-weight: 500;
    }
    &:active {
        background-color: #d5d5d5;
    }
}
</style>
