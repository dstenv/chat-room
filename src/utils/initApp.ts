import { useAdminStore, useUserStore } from '@/stores/user'
import { getAdminToken } from '@/apis/getAdminToken'
import { baseConfig } from '@/utils/config'
import { useChatStore } from '@/stores/chat'
import type { NewFriend } from '@/types'
import { useChatListStore } from '@/stores/chatList'
import type { Router } from 'vue-router'

export interface AdminStorage {
    application: string
    time: number
    token: string
}

export const init = {
    async initAdmin() {
        const adminStore = useAdminStore()
        const adminToken = localStorage.getItem('adminToken')
        if (!adminToken) {
            const result = await getAdminToken({
                grant_type: 'client_credentials',
                client_id: baseConfig.clientID,
                client_secret: baseConfig.clientSecret,
                ttl: 0,
            })

            adminStore.setToken(result.access_token)
            adminStore.setApplication(result.application)
            adminStore.setTime(result.expires_in)
            localStorage.setItem(
                'adminToken',
                JSON.stringify({
                    application: result.application,
                    time: result.expires_in,
                    token: result.access_token,
                })
            )
            return
        }
        const adminInfo: AdminStorage = JSON.parse(adminToken)
        adminStore.setToken(adminInfo.token)
        adminStore.setApplication(adminInfo.application)
        adminStore.setTime(adminInfo.time)
    },
    initUser(router: Router) {
        const userStore = useUserStore()
        const chatStore = useChatStore()
        const userToken = localStorage.getItem('userToken')
        if (!userToken) {
            useChatListStore().clear()
            sessionStorage.clear()
            localStorage.clear()
            router.replace('/begin')
            return
        }
        const userInfo = localStorage.getItem('userInfo')
        const userId = localStorage.getItem('userId')
        userStore.setToken(userToken)
        userStore.setUserID(userId || '')
        userStore.setUserInfo(JSON.parse(userInfo || '{}'))
        chatStore.setUserId(userId || '')
    },
    initNewFriend() {
        const newFriend = localStorage.getItem('newFriend')

        if (newFriend) {
            const newList: NewFriend[] = JSON.parse(newFriend)

            const chatListStore = useChatListStore()
            chatListStore.newFriends = newList
        }
    },
}
