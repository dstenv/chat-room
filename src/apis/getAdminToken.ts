import { request } from '@/apis/base'

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
    url: 'token',
})
