import axios from 'axios'
import { baseUrl } from '@/utils/config'

type Method = 'GET' | 'POST'
type Content = 'application/json'

interface RequestBaseType {
    method: Method
    headers: {
        'Content-Type': Content
    }
    url: string
}

const requestBaseConfig: RequestBaseType = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    url: '',
}

export const request = async <T extends RequestBaseType>(options: T) => {
    options.method = options.method || requestBaseConfig.method
    options.headers = options.headers || requestBaseConfig.headers
    options.url += baseUrl

    const result = await axios({ ...options })
    console.log('apis/base.ts请求结果 --> ', result)
}
