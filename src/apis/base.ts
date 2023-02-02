import axios from 'axios'
import { baseUrl } from '@/utils/config'

export interface RequestBaseType {
    method?: Method
    headers?: {
        'Content-Type': Content
    }
    url?: string
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
    // options.url += baseUrl

    const result: U = await axios({ ...options })
    return result
}
