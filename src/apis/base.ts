import axios from 'axios'
import { baseConfig } from '@/utils/config'
import { useAdminStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

type Method = 'GET' | 'POST' | 'DELETE'
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
}
export interface ResponseBaseType<T> {
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
}

const bodyObj: Record<Method, 'data' | 'param'> = {
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
 * @param {*} T
 * @param {*} U
 * @return {*} Promise U
 */
export const request = <T, U>(
    options: RequestBaseType
): ((body: T) => Promise<U>) =>
    async function (body: T): Promise<U> {
        options.method = options.method || requestBaseConfig.method
        if (options.headers) {
            options.headers = {
                ...requestBaseConfig.headers,
                ...options.headers,
            }
            for (const key of customHeaderKey) {
                if (options.headers[key]) {
                    ;(customHeaderKeyFn[key] as keyFn)(options.headers)
                }
            }
        }
        options.timeout = options.timeout || requestBaseConfig.timeout
        options.url = `/${options.httpType || 'api'}/${baseConfig.orgName}/${
            baseConfig.appName
        }/${options.url}`
        // console.log(options)
        options[bodyObj[options.method as Method]] = body

        const result: ResponseBaseType<U> = await axios({ ...options })
        return result.data as U
    }
