<template>
    <div v-if="friendInfo.friend">
        <XUser
            :user-info="friendInfo.friend"
            :otherInfoList="otherInfoList"
            :right-click="click"
        >
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

        <VanPopup position="right" :show="pageData.showPopup" :overlay="false">
            <div class="friend-oprate c-bg">
                <XHeader
                    title="设置"
                    :left-icon="Tools.getUrl('back.png')"
                    :left-click="
                        () => {
                            pageData.showPopup = false
                        }
                    "
                />

                <div class="oprate-black">
                    <span>{{
                        pageData.isBlack ? '从黑名单移除' : '拉黑联系人'
                    }}</span>
                    <VanSwitch
                        :model-value="pageData.isBlack"
                        @update:model-value="onUpdateValue"
                        active-color="#ee0a24"
                    />
                </div>

                <div class="delete" @click="deleteFriend">删除联系人</div>
            </div>
        </VanPopup>
    </div>
</template>

<script setup lang="tsx">
import XUser from '@/components/XUser/index.vue'
import type { OtherInfoItemType } from '@/components/XOprateItem/index.vue'
import { useFriendStore } from '@/stores/friend'
import { Tools } from '@/utils/tools'
import router from '@/router'
import { useChatStore } from '@/stores/chat'
import XHeader from '@/components/XHeader/index.vue'
import { useChatListStore } from '@/stores/chatList'
import { addBlack } from '@/apis/friend/addBlack'
import { removeBlackList } from '@/apis/friend/removeBlackList'
import { showConfirmDialog, showToast } from 'vant'
import { deleteOneFriend } from '@/apis/friend/deleteFriend'

interface OprateItem {
    text: string
    icon: string
    click?: () => void
}

const friendInfo = useFriendStore()
const chatStore = useChatStore()
const chatListStore = useChatListStore()

const pageData = reactive({
    showPopup: false,
    isBlack: !!chatListStore.blackList.find(
        (item) => item.id === friendInfo.friend?.userid
    ),
})

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
        async click() {
            chatStore.setchatData(
                friendInfo.friend?.userid || '',
                'singleChat',
                'down'
            )

            await router.push({
                path: '/my-chat',
                query: {
                    name:
                        friendInfo.friend?.nickname ||
                        friendInfo.friend?.userid,
                },
            })
        },
    },
    {
        text: '音视频通话',
        icon: Tools.getUrl('call-phone.png'),
        click() {},
    },
]

const click = () => {
    pageData.showPopup = true
}

const onUpdateValue = (newValue: boolean) => {
    pageData.isBlack = newValue
    if (newValue) {
        addBlack({
            usernames: [friendInfo.friend?.userid || ''],
        })
        chatListStore.blackList.push({
            id: friendInfo.friend?.userid || '',
            avatar: friendInfo.friend?.avatar || '',
            nickname: friendInfo.friend?.nickname || '',
        })
    } else {
        removeBlackList(friendInfo.friend?.userid || '')()
        chatListStore.deleteBlack(friendInfo.friend?.userid || '')
    }
}

const deleteFriend = () => {
    showConfirmDialog({
        title: '提示',
        message: '是否确定删除此联系人?',
    })
        .then(async () => {
            deleteOneFriend(friendInfo.friend?.userid || '')()
                .then(() => {
                    showToast('删除成功')
                    pageData.showPopup = false
                })
                .catch(() => {})
        })
        .catch(() => {})
}
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
.friend-oprate {
    width: 100vw;
    height: 100vh;
    .oprate-black {
        padding: 10rem;
        font-size: 14rem;
        border-bottom: 1rem solid #ddd;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
    }
    .delete {
        background-color: #fff;
        margin-top: 20rem;
        padding: 15rem 0;
        text-align: center;
        color: #ee0a24;
        font-size: 16rem;
    }
}
</style>
