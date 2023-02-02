import { request } from '@/apis/base'
import { baseUrl, baseConfig } from './config'
type FolderName = 'imgs' | 'icons'

export default {
    getUrl(imgName: string, folderName: FolderName = 'icons') {
        return new URL(`../assets/${folderName}/${imgName}`, import.meta.url)
            .href
    },

    getAdminToken: async () => {
        request({
            method: 'POST',
            url: `/apis/${baseConfig.orgName}/${baseConfig.appName}/token`,
            data: {
                grant_type: 'client_credentials',
                client_id: baseConfig.clientID,
                client_secret: baseConfig.clientSecret,
                ttl: 0,
            },
        })
    },
}
