import axios from 'axios'
import { baseConfig } from '@/utils/config'

export interface RequestBaseType {
    method?: Method
    headers?: {
        'Content-Type': Content
    }
    url?: string
    data?: any
    param?: any
}

type Method = 'GET' | 'POST'
type Content = 'application/json'

const requestBaseConfig: RequestBaseType = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    url: '',
}

export const request = async <T extends RequestBaseType, U>(
    options: T
): Promise<U> => {
    options.method = options.method || requestBaseConfig.method
    options.headers = options.headers || requestBaseConfig.headers
    options.url = `/apis/${baseConfig.orgName}/${baseConfig.appName}/${options.url}`

    const result: U = await axios({ ...options })
    return result
}
