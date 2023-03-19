import { request } from '../base'

export class GetHistoryUrlRes {
    url!: string
}

export const getHistoryUrl = (time: string) =>
    request<null, GetHistoryUrlRes>({
        url: `chatmessages/${time}`,
        headers: {
            Authorization: true,
        },
    })
