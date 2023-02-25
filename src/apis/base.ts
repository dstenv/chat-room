import axios from 'axios'
import { baseConfig } from '@/utils/config'

type Method = 'GET' | 'POST' | 'DELETE'
type Content = 'application/json'

export interface RequestBaseType {
    method: Method
    headers?: {
        'Content-Type'?: Content
        'Accept'?: Content
        'Authorization': string
    }
    url?: string
    data?: any
    param?: any
    timeout?: number
    httpType?: 'api' | 'apis'
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
    options.url = `/${options.httpType || 'api'}/${baseConfig.orgName}/${
        baseConfig.appName
    }/${options.url}`
    // console.log(options)

    const result: U = await axios({ ...options })
    return result
}

export const request2 = <T extends RequestBaseType, U>(options: T) => {
    return async function (body: T): Promise<U> {
        options.method = options.method || requestBaseConfig.method
        if (options.headers) {
            options.headers = {
                ...requestBaseConfig.headers,
                ...options.headers,
            }
        }
        options.timeout = options.timeout || requestBaseConfig.timeout
        options.url = `/${options.httpType || 'api'}/${baseConfig.orgName}/${
            baseConfig.appName
        }/${options.url}`
        // console.log(options
        options[bodyObj[options.method]] = body

        const result: U = await axios({ ...options })
        return result
    }
}
