import axios from 'axios'
import { baseConfig, chatRoomBaseConfig } from '@/utils/config'
import { useAdminStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { Tools } from '@/utils/tools'
import { useLoading } from '@/singleton/loading'

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
    oprateUrl?: () => string
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
        const loading = useLoading()

        const id = loading.requestId++

        if (loading.loadingInstance) {
            loading.addRequest({
                id,
                finish: false,
            })
        }

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

        if (requestOptions.oprateUrl) {
            requestOptions.url = requestOptions.oprateUrl()
        }

        requestOptions.url = `/${requestOptions.httpType || 'api'}/${
            baseConfig.orgName
        }/${baseConfig.appName}/${requestOptions.url}`

        const bodyKey = bodyObj[requestOptions.method as Method]
        if (bodyKey) {
            requestOptions[bodyKey] = body
        }

        if (requestOptions.method === 'PUT') {
            requestOptions.data = Tools.queryString(
                body as { [key: string]: string }
            )
        }

        if (requestOptions.loading ?? requestBaseConfig.loading) {
            loading.create()
        }
        let result: ResponseBaseType<U>

        try {
            // console.log('requestOptions -->', requestOptions)
            result = await axios({
                ...requestOptions,
            })
        } catch (error) {
            result = new ResponseBaseType<U>()
        } finally {
            loading.finishOneRequest(id)

            loading.close()
        }
        return result.data as U
    }

export const errorData = {
    'user not found': '没有找到该用户',
    'network error': '网络错误',
    'invalid password': '密码错误',
}
