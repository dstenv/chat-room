import { defineStore } from 'pinia'
import type { UserProPertyType } from '@/types'
import { Tools } from '@/utils/tools'

export const useUserStore = defineStore('user', () => {
    const token = ref('')
    const userId = ref('')

    const userInfo = ref<UserProPertyType>()

    const setToken = (value: string) => {
        token.value = value
    }
    const setUserID = (value: string) => {
        userId.value = value
    }

    const setUserInfo = (info: UserProPertyType) => {
        userInfo.value = { ...userInfo.value, ...info }
    }

    return {
        token,
        userId,
        userInfo,
        setToken,
        setUserID,
        setUserInfo,
    }
})

export const useAdminStore = defineStore('admin', () => {
    const token = ref('')
    const application = ref('')
    const time = ref(0)

    const setToken = (value: string) => {
        token.value = value
    }
    const setApplication = (value: string) => {
        application.value = value
    }
    const setTime = (value: number) => {
        time.value = value
    }

    return { token, application, time, setToken, setApplication, setTime }
})
