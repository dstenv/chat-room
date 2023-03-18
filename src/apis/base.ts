import axios from 'axios'
import { baseConfig, chatRoomBaseConfig } from '@/utils/config'
import { useAdminStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { showLoadingToast } from 'vant'
import type { ToastWrapperInstance } from 'vant/lib/toast/types'

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT'
type Content = 'application/json'
type HeaderKey = 'Content-Type' | 'Accept' | 'Authorization'
type keyFn = (payload: Partial<Record<HeaderKey, string | boolean>>) => void
type HeaderKeyFn = Partial<Record<HeaderKey, keyFn>>

export interface RequestBaseType {
    method?: Method
    headers?: Partial<Record<HeaderKey, boolean | string>>
    url?: string
    data?: any
    param?: any
    timeout?: number
    httpType?: 'api' | 'apis'
    loading?: boolean
}
export class ResponseBaseType<T> {
    data?: T
}

const requestBaseConfig: RequestBaseType = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': '',
    },
    url: '',
    timeout: 5000,
    loading: true,
}
let loadingToastInst: ToastWrapperInstance | null = null

const bodyObj: Partial<Record<Method, 'data' | 'param'>> = {
    GET: 'param',
    POST: 'data',
    DELETE: 'data',
}

// 自定义请求头
const customHeaderKey: HeaderKey[] = ['Authorization']
const customHeaderKeyFn: HeaderKeyFn = {
    Authorization: (payload) => {
        const adminStore = useAdminStore()
        const { token } = storeToRefs(adminStore)
        payload.Authorization = `Bearer ${token.value}`
    },
}

// export const request = async <T extends RequestBaseType, U>(
//     options: T
// ): Promise<U> => {
//     options.method = options.method || requestBaseConfig.method
//     if (options.headers) {
//         options.headers = {
//             ...requestBaseConfig.headers,
//             ...options.headers,
//         }
//         for (const key of customHeaderKey) {
//             if (options.headers[key]) {
//                 ;(customHeaderKeyFn[key] as keyFn)(options.headers)
//             }
//         }
//     }
//     options.timeout = options.timeout || requestBaseConfig.timeout
//     options.url = `/${options.httpType || 'api'}/${baseConfig.orgName}/${
//         baseConfig.appName
//     }/${options.url}`
//     // console.log(options)

//     const result: U = await axios({ ...options })
//     return result
// }

/**
 * @description 初步完成 未测试
 * @param {*} T 入参类型
 * @param {*} U 回参类型
 * @return {*} Promise U 回参
 */
export const request = <T, U>(
    options: RequestBaseType
): ((body?: T) => Promise<U>) =>
    async function (body?: T): Promise<U> {
        const requestOptions = { ...options }
        requestOptions.method =
            requestOptions.method || requestBaseConfig.method
        // 自定义请求头
        if (requestOptions.headers) {
            requestOptions.headers = {
                ...requestBaseConfig.headers,
                ...requestOptions.headers,
            }
            for (const key of customHeaderKey) {
                if (
                    requestOptions.headers[key] === true &&
                    requestOptions.headers[key]
                ) {
                    ;(customHeaderKeyFn[key] as keyFn)(requestOptions.headers)
                }
            }
        }
        requestOptions.timeout =
            requestOptions.timeout || requestBaseConfig.timeout
        requestOptions.url = `/${requestOptions.httpType || 'api'}/${
            chatRoomBaseConfig.orgName
        }/${chatRoomBaseConfig.appName}/${requestOptions.url}`

        const bodyKey = bodyObj[requestOptions.method as Method]
        if (bodyKey) {
            requestOptions[bodyKey] = body
        }

        if (requestOptions.loading ?? requestBaseConfig.loading) {
            loadingToastInst = showLoadingToast({
                message: '加载中',
                forbidClick: true,
                duration: 0,
            })
        }
        let result: ResponseBaseType<U>

        try {
            result = await axios({
                ...requestOptions,
            })
        } catch (error) {
            result = new ResponseBaseType<U>()
        } finally {
            if (loadingToastInst) {
                loadingToastInst.close()
            }
        }
        return result.data as U
    }

export const errorData = {
    'user not found': '没有找到该用户',
    'network error': '网络错误',
    'invalid password': '密码错误',
}
