import { request } from '../base'

export class SetUsetInfoRes {}

export const setUsetInfo = (userID: string) =>
    request<Object, SetUsetInfoRes>({
        method: 'PUT',
        url: `metadata/user/${userID}`,
        httpType: 'apis',
        headers: {
            'Authorization': true,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
