import { request } from '@/apis/base'
import { baseConfig } from '@/utils/config'
import type { RequestBaseType } from '@/apis/base'

type GrantType = 'client_credentials'

export interface GetAdminTokenBody extends RequestBaseType {
    data: {
        grant_type: GrantType
        client_id: string
        client_secret: string
        ttl: number
    }
}

export class GetAdminTokenRet {
    data!: {
        access_token: string
        expires_in: number
        application: string
    }
}

export const getAdminToken = async () => {
    const result = await request<GetAdminTokenBody, GetAdminTokenRet>({
        method: 'POST',
        url: `token`,
        data: {
            grant_type: 'client_credentials',
            client_id: baseConfig.clientID,
            client_secret: baseConfig.clientSecret,
            ttl: 0,
        },
    })
    return result.data
}
