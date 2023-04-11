<template>
    <div v-if="friendInfo.friend">
        <XUser :user-info="friendInfo.friend" :otherInfoList="otherInfoList">
            <template #oprate>
                <div
                    v-for="item in oprateLlist"
                    :key="item.text"
                    class="oprate-item"
                    @click="item.click"
                >
                    {{ item.text }}
                </div>
            </template>
        </XUser>
    </div>
</template>

<script setup lang="tsx">
import XUser from '@/components/XUser/index.vue'
import type { OtherInfoItemType } from '@/components/XUser/components/other-item.vue'
import { useFriendStore } from '@/stores/friend'
import { Tools } from '@/utils/tools'
import router from '@/router'
import { useChatStore } from '@/stores/chat'

interface OprateItem {
    text: string
    icon: string
    click?: () => void
}

const friendInfo = useFriendStore()
const chatStore = useChatStore()

const otherInfoList: OtherInfoItemType[] = [
    {
        text: '个性签名',
        border: true,
        render() {
            return <div>暂无个性签名</div>
        },
    },
    {
        text: '朋友圈',
        border: true,
    },
    {
        text: '视频号',
    },
]

const oprateLlist: OprateItem[] = [
    {
        text: '发消息',
        icon: Tools.getUrl('send-msg.png'),
        click() {
            chatStore.setTargetId(friendInfo.friend?.userid)

            router.push('/my-chat')
        },
    },
    {
        text: '音视频通话',
        icon: Tools.getUrl('call-phone.png'),
        click() {},
    },
]
</script>

<style scoped lang="scss">
.oprate-item {
    background-color: #fff;
    font-size: 17rem;
    color: #5f6891;
    font-weight: bold;
    letter-spacing: 1rem;
    margin-top: 10rem;
    padding: 18rem 0;
    text-align: center;
}
</style>
