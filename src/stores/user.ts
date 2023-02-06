import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const token = ref('')
    const uuid = ref('')

    const setToken = (value: string) => {
        token.value = value
    }
    const setUUid = (value: string) => {
        uuid.value = value
    }

    return { token, uuid, setToken, setUUid }
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
