import { EaseChatClient } from '@/utils/config'
import type { EasemobChat } from 'easemob-websdk'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/apis/user/getUserInfo'
import tools from '@/utils/tools'

export const useChatListStore = defineStore('chatList', () => {
    const chatList = ref<EasemobChat.conversationList[]>([])

    const getChatList = async () => {
        try {
            const result = await EaseChatClient.getConversationlist()
            chatList.value = (result.data as any).channel_infos

            for (let i = 0; i < chatList.value.length; i++) {
                const property = await getUserInfo(
                    chatList.value[i].lastMessage.to
                )()
                chatList.value[i].lastMessage.payload = {
                    nickname: property.data.nickname,
                    sex: property.data.sex,
                    avatar:
                        property.data.avatar ||
                        tools.getUrl(
                            property.data.sex === '2'
                                ? 'avatar-default-woman.png'
                                : 'avatar-default-man.png'
                        ),
                }
            }
            console.log('chatList.value -->', chatList.value)
        } catch (error) {
            console.log('getChatList error -->', error)
        }
    }

    return {
        chatList,
        getChatList,
    }
})
