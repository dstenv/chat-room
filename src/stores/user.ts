import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    let admin = reactive({
        token: '',
        application: '',
        time: 0,
    })
    let user = reactive({
        token: '',
        uuid: '',
    })

    const setAdmin = (info: {
        token: string
        application: string
        time: number
    }) => {
        admin = { ...info }
    }
    const setUser = (info: { token: string; uuid: string }) => {
        user = { ...info }
    }

    return { user, admin, setAdmin, setUser }
})
