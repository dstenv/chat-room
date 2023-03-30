import { showLoadingToast } from 'vant'
import type { ToastWrapperInstance } from 'vant/lib/toast/types'

class Loading {
    static LoadingInst: null | ToastWrapperInstance

    constructor() {
        Loading.LoadingInst = null
    }

    static getInstance() {
        if (!Loading.LoadingInst) {
            Loading.LoadingInst = showLoadingToast({
                message: '加载中',
                forbidClick: true,
                duration: 0,
            })
        }
        return Loading.LoadingInst
    }

    show() {}

    close() {
        Loading.LoadingInst?.close()

        Loading.LoadingInst = null
    }
}

export const useLoading = () => Loading.getInstance()
