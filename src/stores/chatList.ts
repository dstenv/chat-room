import { EaseChatClient } from '@/utils/config'
import type { EasemobChat } from 'easemob-websdk'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/apis/user/getUserInfo'
import { Tools } from '@/utils/tools'
import type { UserProPertyType, NewFriend, BlackListItem } from '@/types'
import { getFriendList } from '@/apis/friend/getFriendList'
import { useUserStore } from './user'
import { getBlackList } from '@/apis/user/getBlackList'

export const useChatListStore = defineStore(
    'chatList',
    () => {
        const chatList = ref<
            (EasemobChat.conversationList & { himId: string })[]
        >([])
        const friendList = ref<UserProPertyType[]>([])
        const newFriends = ref<NewFriend[]>([])
        const blackList = ref<BlackListItem[]>([])

        const getStatus = {
            getChat: false,
            getFriend: false,
            getBlack: false,
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
                const find = newFriends.value.find(
                    (item) => item.from === msg.from
                )

                const content: NewFriend = JSON.parse(msg.status || '')

                if (!find) {
                    newFriends.value.push({
                        avatar: content.avatar || '',
                        from: msg.from,
                        text: content.text || '',
                        read: false,
                        agree: false,
                        nickname: content.nickname || '',
                    })
                    localStorage.setItem(
                        'newFriend',
                        JSON.stringify(newFriends.value)
                    )
                } else {
                    find.text = content.text || ''
                    find.nickname = content.nickname || ''
                }
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

                chatList.value = chatList.value.map((item) => ({
                    ...item,
                    himId: /_.*@/.exec(item.channel_id)![0].slice(1, -1) || '',
                }))

                for (let i = 0; i < chatList.value.length; i++) {
                    const property = await getUserInfo(
                        chatList.value[i].himId
                    )()
                    chatList.value[i].lastMessage.payload = {
                        nickname: property.data.nickname,
                        sex: property.data.sex,
                        avatar: Tools.getDefaultAvatar(
                            property.data.sex === '2',
                            property.data.avatar
                        ),
                    }
                }
                console.log('chatList.value -->', chatList.value)
            } catch (error) {
                console.log('getChatList error -->', error)
            } finally {
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
                        avatar: Tools.getDefaultAvatar(
                            property.data.sex === '2',
                            property.data.avatar
                        ),
                        onLine: false,
                    })
                    deleteManyFriend()
                }
            } catch (error) {
                console.log('getFriends error -->', error)
            } finally {
                getStatus.getFriend = false
            }
        }

        const getBlackFriendList = async () => {
            blackList.value = []
            try {
                const result = await getBlackList()

                for (let i = 0; i < result.data.length; i++) {
                    const property = await getUserInfo(result.data[i])()

                    blackList.value.push({
                        id: result.data[i],
                        nickname: property.data.nickname || '',
                        avatar: Tools.getDefaultAvatar(
                            property.data.sex === '2',
                            property.data.avatar
                        ),
                    })
                }
                blackList.value = Tools.deleteRepeat(blackList.value, 'id')
            } catch (error) {
                console.log('getBlackList error -->', error)
            }
        }

        /**
         * 设置某个会话的最后一条消息
         * @param himId 对方的会话id
         * @param content 设置的消息内容
         */
        const setLastMsg = (himId: string, content: string, unread = false) => {
            console.log('setLastmsg -->', himId, content)
            const find = chatList.value.find((item) => item.himId === himId)

            if (find) {
                ;(find.lastMessage as any).msg = content
                if (unread) {
                    find.unread_num++
                }
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

        /**
         * 从黑名单列表删除一项
         */
        const deleteBlack = (id: string) => {
            blackList.value = blackList.value.filter((item) => item.id !== id)
        }

        const deleteManyFriend = () => {
            friendList.value = Tools.deleteRepeat(friendList.value, 'userid')
        }

        const unWatch = () => {
            EaseChatClient.removeEventHandler(watchHandlerKey)
        }

        return {
            chatList,
            friendList,
            newFriends,
            blackList,
            getChatList,
            watchMessage,
            unWatch,
            getFriends,
            deleteManyFriend,
            setLastMsg,
            getBlackFriendList,
            deleteBlack,
        }
    },
    {
        persist: {
            enabled: true,
        },
    }
)
