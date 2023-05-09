import { EaseChatClient } from '@/utils/config'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/apis/user/getUserInfo'
import { Tools } from '@/utils/tools'
import type {
    UserProPertyType,
    NewFriend,
    BlackListItem,
    GroupItem,
} from '@/types'
import { getFriendList } from '@/apis/friend/getFriendList'
import { useUserStore } from './user'
import { getBlackList } from '@/apis/user/getBlackList'
import { CommonConfig } from '@/common/common'
import type { EasemobChat } from 'easemob-websdk'
import { showToast } from 'vant'
import { useChatStore } from './chat'

export const useChatListStore = defineStore(
    'chatList',
    () => {
        const chatList = ref<
            (EasemobChat.conversationList & { himId: string })[]
        >([])
        const friendList = ref<UserProPertyType[]>([])
        const newFriends = ref<NewFriend[]>([])
        const blackList = ref<BlackListItem[]>([])
        const groupList = ref<GroupItem[]>([])
        const momentGroup = ref<GroupItem>({} as GroupItem)

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
                        avatar:
                            content.avatar ||
                            Tools.getUrl('avatar-default-uman.png'),
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
                    find.avatar = content.avatar
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
                console.log('desc -->', blackList.value)

                chatList.value = chatList.value.map((item) => ({
                    ...item,
                    himId: /_.*@/.exec(item.channel_id)![0].slice(1, -1) || '',
                }))

                for (let i = 0; i < chatList.value.length; i++) {
                    if (
                        blackList.value.find(
                            (item) => item.id === chatList.value[i].himId
                        )
                    ) {
                        chatList.value.splice(i, 1)
                    }
                }

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

        const getGroupList = async () => {
            groupList.value = []
            try {
                const list = await EaseChatClient.getJoinedGroups({
                    pageNum: 0,
                    pageSize: CommonConfig.GET_GROUP_LIST_SIZE,
                })
                if (list.data) {
                    groupList.value = list.data.map((item) => ({
                        ...item,
                        groupimg: Tools.getUrl('group-default.png'),
                    }))
                    groupList.value.forEach((item) => {
                        const find = chatList.value.find(
                            (chat) => chat.himId === item.groupid
                        )

                        if (find) {
                            find.lastMessage.payload = {
                                ...find.lastMessage.payload,
                                nickname: item.groupname,
                                avatar: item.groupimg,
                            }
                        }
                    })
                }
            } catch (error) {
                showToast('获取群组列表失败，请稍候刷新')
            }
        }

        const getFriends = async () => {
            if (getStatus.getFriend) return

            try {
                getStatus.getFriend = true
                const result = await getFriendList(
                    `users/${userStore.userId}/contacts/users`
                )()

                if (result.data.length === 0) {
                    friendList.value = []
                    return
                }

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

        const getMoment = async (create: boolean) => {
            try {
                const list = await EaseChatClient.getJoinedGroups({
                    pageNum: 0,
                    pageSize: CommonConfig.GET_GROUP_LIST_SIZE,
                })

                const createMoment = async () => {
                    const result = await EaseChatClient.createGroup({
                        data: {
                            ...CommonConfig.CREATE_GROUP_CONFIG,
                            public: false,
                            allowinvites: true,
                            desc: '朋友圈',
                            groupname: 'moment',
                            members: friendList.value.map(
                                (item) => item.userid || ''
                            ),
                            inviteNeedConfirm: false,
                        },
                    })
                    if (result.data) {
                        momentGroup.value = {
                            groupid: result.data.groupid,
                            groupname: 'moment',
                            groupimg: Tools.getUrl('group-default.png'),
                        }
                        useChatStore().setchatData(
                            result.data.groupid,
                            'groupChat'
                        )
                        await useChatStore().sendMessage(
                            'txt',
                            {
                                chatType: 'groupChat',
                                msg: 'welcome',
                                to: result.data.groupid,
                            },
                            {
                                chatType: 'groupChat',
                                id: '',
                                msg: 'welcome',
                                time: +new Date(),
                                type: 'txt',
                                to: result.data.groupid,
                            },
                            () => {}
                        )
                        getChatList()
                        // groupList.value.push({ ...momentGroup.value })
                    }
                }

                if (list.data) {
                    const moment = list.data.find(
                        (item) => item.groupname === 'moment'
                    )

                    if (moment) {
                        console.log('存在moment的群组')
                        momentGroup.value = {
                            ...moment,
                            groupimg: Tools.getUrl('group-default.png'),
                        }
                    } else if (create) {
                        await createMoment()
                    }
                } else if (create) {
                    await createMoment()
                }
                console.log('moment -->', momentGroup.value)
            } catch (error) {}
        }

        const pullIntoGroup = async (user: string) => {
            console.log(`邀请${user}进入群聊${momentGroup.value.groupid}`)
            await EaseChatClient.inviteUsersToGroup({
                groupId: momentGroup.value.groupid,
                users: [user],
            })

            EaseChatClient.listGroupMembers({
                pageNum: 1,
                pageSize: 100,
                groupId: momentGroup.value.groupid,
            }).then((list) => {
                console.log('群成员 -->', list.data)
            })
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
                /** 收到群聊邀请 */
                onGroupEvent(data) {
                    console.log('收到群聊邀请 -->', data)
                },

                // 当前用户发送的好友请求经过了对方同意。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，同意加好友，则用户 A 收到该事件。
                async onContactAgreed(msg) {
                    console.log('同意好友申请 -->', msg)
                    const property = await getUserInfo(msg.from)()
                    friendList.value.push({
                        userid: msg.from,
                        sex: property.data.sex || '1',
                        avatar: Tools.getDefaultAvatar(
                            property.data.avatar === '2',
                            property.data.avatar
                        ),
                        nickname: property.data.nickname || '',
                        onLine: false,
                    })
                    deleteManyFriend()
                    if (!momentGroup.value.groupid) {
                        await getMoment(true)
                    }
                    pullIntoGroup(msg.from)
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

        const clear = () => {
            getStatus.getBlack = false
            getStatus.getChat = false
            getStatus.getFriend = false

            friendList.value = []
            newFriends.value = []
            blackList.value = []
            groupList.value = []
            momentGroup.value = {} as GroupItem
        }

        return {
            chatList,
            friendList,
            newFriends,
            blackList,
            groupList,
            momentGroup,
            getChatList,
            watchMessage,
            unWatch,
            getFriends,
            deleteManyFriend,
            setLastMsg,
            getBlackFriendList,
            deleteBlack,
            getGroupList,
            getMoment,
            pullIntoGroup,
            clear,
        }
    },
    {
        persist: {
            enabled: true,
        },
    }
)
