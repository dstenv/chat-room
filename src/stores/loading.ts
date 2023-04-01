import { useLoading } from '@/hooks/loading'
import { defineStore } from 'pinia'
import type { ToastWrapperInstance } from 'vant/lib/toast/types'
interface RequestItem {
    id: number
    finish: boolean
}

export const useLoadingStore = defineStore('loadingStore', () => {
    const loadingInstance = ref<null | ToastWrapperInstance>(null)

    const requestId = ref(1)

    const request = ref<RequestItem[]>([])

    const create = () => {
        loadingInstance.value = useLoading()
    }

    const close = () => {
        loadingInstance.value?.close()
        loadingInstance.value = null
    }

    return {
        request,
        loadingInstance,
        requestId,
        create,
        close,
    }
})
