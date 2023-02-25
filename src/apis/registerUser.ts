import { request } from '@/apis/base'

export class UserInfo {
    username!: string
    password!: string
    nickname!: string
}

export class RegisterResult {}

// export const registerUser = async (info: UserInfo) => {
//     const adminStore = useAdminStore()
//     const { token } = storeToRefs(adminStore)
//     try {
//         await request<RegisterBody, RegisterResult>({
//             method: 'POST',
//             url: 'users',
//             headers: {
//                 Authorization: `Bearer ${token.value}`,
//             },
//             data: info,
//         })
//         return true
//     } catch (error) {
//         return false
//     }
// }

export const registerUser = request<UserInfo, RegisterResult>({
    method: 'POST',
    url: 'users',
    headers: {
        // 是否开启自定义 Authorization
        Authorization: true,
    },
})
