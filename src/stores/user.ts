import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const adminToken = ref('')
    const userToken = ref('')

    const setAdminToken = (token: string) => {
        adminToken.value = token
    }
    const setUserToken = (token: string) => {
        userToken.value = token
    }

    return { userToken, adminToken, setAdminToken, setUserToken }
})
