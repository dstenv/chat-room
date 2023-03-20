import { defineStore } from 'pinia'
import type { UserProPertyType } from '@/types/index'

export const useFriendStore = defineStore('friend', () => {
    const friend = ref<UserProPertyType>()

    const setFriend = (info: UserProPertyType) => {
        friend.value = { ...info }
    }

    return {
        friend,
        setFriend,
    }
})
