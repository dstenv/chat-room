import { request } from '@/apis/base'
import { baseUrl, baseConfig } from '@/utils/config'
import type { RequestBaseType } from '@/apis/base'

type GrantType = 'client_credentials'

export class GetAdminTokenBody {
    grant_type!: GrantType
    client_id!: string
    client_secret!: string
    ttl!: number
}

export class GetAdminTokenRet {
    access_token!: string
    expires_in!: number
    application!: string
}

export const getAdminToken = request<GetAdminTokenBody, GetAdminTokenRet>({
    method: 'POST',
    url: `/apis/${baseConfig.orgName}/${baseConfig.appName}/token`,
    data: {
        grant_type: 'client_credentials',
        client_id: baseConfig.clientID,
        client_secret: baseConfig.clientSecret,
        ttl: 0,
    },
})
