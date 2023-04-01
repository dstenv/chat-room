import { showLoadingToast } from 'vant'
import type { ToastWrapperInstance } from 'vant/lib/toast/types'
interface RequestItem {
    id: number
    finish: boolean
}

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

/**
 * TODO loading工具类 主要实现多个请求只有当每一个请求都完成再关闭loading
 */
class LoadingUtil {
    requestId = 1
    request: RequestItem[] = []
    loadingInstance: null | ToastWrapperInstance
    static loadingUtil: null | LoadingUtil

    static getInst() {
        if (!LoadingUtil.loadingUtil) {
            LoadingUtil.loadingUtil = new this()
        }
        return LoadingUtil.loadingUtil
    }

    constructor() {
        this.loadingInstance = null
        LoadingUtil.loadingUtil = null
    }

    create() {
        this.loadingInstance = Loading.getInstance()
    }
    close() {
        if (this.request.every((item) => item.finish)) {
            this.loadingInstance?.close()

            this.loadingInstance = null
        }
    }

    addRequest(request: RequestItem) {
        this.request.push(request)
    }

    finishOneRequest(id: number) {
        for (let i = 0; i < this.request.length; i++) {
            if (this.request[i].id === id) {
                this.request[i].finish = false
            }
        }
    }
}

export const useLoading = () => LoadingUtil.getInst()
