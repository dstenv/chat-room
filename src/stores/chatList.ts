import { EaseChatClient } from '@/utils/config'
import type { EasemobChat } from 'easemob-websdk'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/apis/user/getUserInfo'
import { Tools } from '@/utils/tools'
import type { UserProPertyType, NewFriend } from '@/types'
import { getFriendList } from '@/apis/friend/getFriendList'
import { useUserStore } from './user'

export const useChatListStore = defineStore('chatList', () => {
    const chatList = ref<EasemobChat.conversationList[]>([])
    const friendList = ref<UserProPertyType[]>([])
    const newFriends = ref<NewFriend[]>([])

    const getStatus = {
        getChat: false,
        getFriend: false,
    }

    const watchHandlerKey = `chat_list_store_${Date.now().toString(
        36
    )}${Math.floor(Math.random() * 100 + 1 + 1)}`

    const contactOprate: Record<
        EasemobChat.ContactMsgBody['type'],
        (msg: EasemobChat.ContactMsgBody) => void
    > = {
        subscribe(msg) {
            /**
             * TODO 这里需要判断当时是否在新的朋友列表页面，如果是则设置read状态为true
             */
            newFriends.value.push({
                avatar: '',
                from: msg.from,
                text: msg.status || '',
                read: false,
            })
            localStorage.setItem('newFriend', JSON.stringify(newFriends.value))
        },
        subscribed() {},
        unsubscribed() {},
    }

    const userStore = useUserStore()

    const getChatList = async () => {
        if (getStatus.getChat) return

        try {
            getStatus.getChat = true
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
                        Tools.getUrl(
                            property.data.sex === '2'
                                ? 'avatar-default-woman.png'
                                : 'avatar-default-man.png'
                        ),
                }
            }
            console.log('chatList.value -->', chatList.value)
        } catch (error) {
            console.log('getChatList error -->', error)
            getStatus.getChat = false
        }
    }

    const getFriends = async () => {
        if (getStatus.getFriend) return

        try {
            getStatus.getFriend = true
            const result = await getFriendList(
                `users/${userStore.userId}/contacts/users`
            )()

            for (let i = 0; i < result.data.length; i++) {
                const property = await getUserInfo(result.data[i])()
                friendList.value.push({
                    userid: result.data[i],
                    nickname: property.data.nickname || result.data[i],
                    sex: property.data.sex,
                    avatar:
                        property.data.avatar ||
                        Tools.getUrl(
                            property.data.sex === '2'
                                ? 'avatar-default-woman.png'
                                : 'avatar-default-man.png'
                        ),
                })
            }
        } catch (error) {
            console.log('getFriends error -->', error)
            getStatus.getFriend = false
        }
    }

    const watchMessage = () => {
        console.log('watchMessage -->', watchHandlerKey)

        EaseChatClient.addEventHandler(watchHandlerKey, {
            /** 收到好友申请 */
            onContactInvited: (msg) => {
                console.log('收到好友申请 msg -->', msg)
                contactOprate[msg.type] && contactOprate[msg.type](msg)
            },
        })
    }

    const unWatch = () => {
        EaseChatClient.removeEventHandler(watchHandlerKey)
    }

    return {
        chatList,
        friendList,
        newFriends,
        getChatList,
        watchMessage,
        unWatch,
        getFriends,
    }
})
