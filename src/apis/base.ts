import axios from 'axios'
import { baseConfig } from '@/utils/config'

type Method = 'GET' | 'POST'
type Content = 'application/json'

export interface RequestBaseType {
    method?: Method
    headers?: {
        'Content-Type': Content
        'Accept': Content
        'Authorization': string
    }
    url?: string
    data?: any
    param?: any
    timeout?: number
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

export const request = async <T extends RequestBaseType, U>(
    options: T
): Promise<U> => {
    options.method = options.method || requestBaseConfig.method
    if (options.headers) {
        options.headers = {
            ...requestBaseConfig.headers,
            ...options.headers,
        }
    }
    options.timeout = options.timeout || requestBaseConfig.timeout
    options.url = `/apis/${baseConfig.orgName}/${baseConfig.appName}/${options.url}`

    const result: U = await axios({ ...options })
    return result
}
