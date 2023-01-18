import axios from 'axios'
import { baseUrl } from '@/utils/config'

const requestBaseConfig = {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
    url: '',
}

type Request = typeof requestBaseConfig

export const request = async <T>(options: T & Request) => {
    options.method = options.method || requestBaseConfig.method
    options.headers = options.headers || requestBaseConfig.headers
    options.url += baseUrl

    const result = await axios({ ...options })
    console.log('apis/base.ts请求结果 --> ', result)
}
