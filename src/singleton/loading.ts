import { showLoadingToast } from 'vant'
import type { ToastWrapperInstance } from 'vant/lib/toast/types'
interface RequestItem {
    id: number
    finish: boolean
}

class Loading {
    static LoadingInst: null | Loading = null
    static Load: null | ToastWrapperInstance

    static getInstance() {
        if (!Loading.LoadingInst) {
            Loading.LoadingInst = new Loading()
        }
        return Loading.LoadingInst
    }

    show() {
        Loading.Load = showLoadingToast({
            message: '加载中',
            forbidClick: true,
            duration: 0,
        })
    }

    close() {
        Loading.Load?.close()
        Loading.LoadingInst = null

        Loading.Load = null
    }
}

/**
 * TODO loading工具类 主要实现多个请求只有当每一个请求都完成再关闭loading
 */
class LoadingUtil {
    requestId = 1
    request: RequestItem[] = []
    static loadingInstance: null | Loading
    static loadingUtil: null | LoadingUtil

    static getInst() {
        if (!LoadingUtil.loadingUtil) {
            LoadingUtil.loadingUtil = new LoadingUtil()
            LoadingUtil.loadingInstance = Loading.getInstance()
        }
        return LoadingUtil.loadingUtil
    }

    create() {
        LoadingUtil.loadingInstance?.show()
    }
    close() {
        if (
            this.request.length > 0 &&
            this.request.every((item) => item.finish)
        ) {
            LoadingUtil.loadingInstance?.close()

            LoadingUtil.loadingInstance = null
            LoadingUtil.loadingUtil = null

            this.request = []
            this.requestId = 1
        }
    }

    addRequest(request: RequestItem) {
        this.request.push(request)
    }

    finishOneRequest(id: number) {
        for (let i = 0; i < this.request.length; i++) {
            if (this.request[i].id === id) {
                this.request[i].finish = true
            }
        }
    }
}

export const useLoading = () => LoadingUtil.getInst()
