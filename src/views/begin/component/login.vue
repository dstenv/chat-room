<template>
    <div
        class="login"
        :style="{
            backgroundImage: `url(${bg})`,
        }"
    >
        <div class="form">
            <div v-for="item in formList" :key="item.key" class="form-item">
                <span>{{ item.label }}</span>
                <input
                    v-model="userInfo[item.key]"
                    :placeholder="item.placeholder"
                    :maxlength="item.maxlength || 20"
                    :type="item.type || 'text'"
                />
            </div>
            <div style="padding: 24rem 24rem 10rem; width: 100%">
                <div class="btn" @click="login">登录</div>
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { loginUser, LoginBody } from '@/apis/loginUser'
import { useUserStore } from '@/stores/user'
import { Tools } from '@/utils/tools'
import { isUserId } from '@/utils/validate'
import { showToast } from 'vant'
import { errorData } from '@/apis/base'
import { useChatStore } from '@/stores/chat'
import { getUserInfo } from '@/apis/user/getUserInfo'

export interface RuleItem {
    message: string
    validator: (value: string | number) => boolean
}

type UserInfoKey = 'username' | 'password'

interface FormItem {
    name: string
    label: string
    placeholder: string
    key: UserInfoKey
    type: 'password' | 'number' | 'text'
    maxlength?: number
}

const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()

const bg = Tools.getUrl('login-bg.png', 'imgs')

const userInfo = reactive({
    username: '',
    password: '',
})

const formList: FormItem[] = [
    {
        key: 'username',
        label: '用户ID',
        name: '用户ID',
        placeholder: '请输入6-10位用户ID',
        maxlength: 11,
        type: 'text',
    },
    {
        key: 'password',
        label: '密码',
        name: '密码',
        placeholder: '请输入用户密码',
        type: 'password',
    },
]

const rules: Partial<Record<UserInfoKey, RuleItem>> = {
    username: {
        message: '请输入有效的用户ID',
        validator(value) {
            isUserId.lastIndex = 0
            return !isUserId.test(value as string)
        },
    },
    password: {
        message: '请输入有效的密码',
        validator(value) {
            return !!(value as string).trim()
        },
    },
}

const validate = () => {
    for (const key in userInfo) {
        if (
            rules[key as UserInfoKey] &&
            !rules[key as UserInfoKey]?.validator(userInfo[key as UserInfoKey])
        ) {
            showToast(rules[key as UserInfoKey]?.message)
            return false
        }
    }
    return true
}

const login = async () => {
    try {
        if (!validate()) {
            return
        }
        // 登录 获取token
        const login = new LoginBody()
        for (const key in login) {
            if (userInfo[key as UserInfoKey]) {
                login[key as UserInfoKey] = userInfo[key as UserInfoKey]
            }
        }
        try {
            const result = await loginUser(login)
            const userInfo = await getUserInfo(result.user.username)()

            userStore.setToken(result.access_token)
            userStore.setUserID(result.user.username)
            userStore.setUserInfo(userInfo.data)
            chatStore.setUserId(result.user.username)

            // console.log(userStore, 'desc')
            localStorage.setItem('userToken', result.access_token)
            localStorage.setItem('userId', result.user.username)
            localStorage.setItem('userInfo', JSON.stringify(userInfo.data))

            router.replace({
                path: '/main/pages/chat',
            })
        } catch (error) {
            console.log(error, 'error')
            const key =
                (error as any).response.data.error_description ||
                'network error'
            showToast(errorData[key as keyof typeof errorData])
        }
    } catch (error) {}
}
</script>

<style scoped lang="scss">
@keyframes inpActive {
    0% {
        border-bottom: 2rem solid #a5a5a5;
    }
    100% {
        border-bottom: 2rem solid #59ce61;
    }
}

.login {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-size: cover;
    .van-form {
        padding: 40rem 10rem 10rem 10rem;
        border-radius: 10rem;
    }
    .form {
        width: 90%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 20rem;
        padding: 30rem 20rem;
        .form-item {
            width: 90%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5rem 10rem;
            span {
                font-size: 12rem;
            }
            input {
                box-sizing: border-box;
                padding: 10rem 0;
                padding-left: 5rem;
                width: 80%;
                border: none;
                outline: none;
                background-color: transparent;
                border-bottom: 2rem solid #a5a5a5;
                position: relative;
                &:focus {
                    animation: inpActive 0.5s linear 1;
                    border-bottom: 2rem solid #59ce61;
                }
            }
        }
    }
}
</style>
