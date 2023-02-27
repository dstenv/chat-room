<template>
    <div class="login">
        <van-form @submit="login" ref="formRef">
            <van-cell-group inset>
                <van-field
                    v-for="item in formList"
                    :key="item.key"
                    v-model="userInfo[item.key]"
                    :name="item.name"
                    :label="item.label"
                    :placeholder="item.placeholder"
                    autocomplete="“off”"
                    :rules="[rules[item.key] ?? {}]"
                    :maxlength="item.maxlength ?? 20"
                />
            </van-cell-group>
            <div style="padding: 24rem">
                <van-button
                    round
                    block
                    type="primary"
                    native-type="submit"
                    color="#59ce61"
                >
                    登录
                </van-button>
                <slot />
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import type { FieldRule, FormInstance } from 'vant'
import { loginUser, LoginBody } from '@/apis/loginUser'
import { useUserStore } from '@/stores/user'
import { EaseChatClient } from '@/utils/config'

const router = useRouter()

type UserInfoKey = 'username' | 'password'

interface FormItem {
    name: string
    label: string
    placeholder: string
    key: UserInfoKey
    maxlength?: number
}

const formRef = ref<FormInstance>({} as FormInstance)

const userInfo = reactive({
    username: '',
    password: '',
})

const formList: FormItem[] = [
    {
        key: 'username',
        label: '用户ID',
        name: '用户ID',
        placeholder: '请输入用户ID',
    },
    {
        key: 'password',
        label: '密码',
        name: '密码',
        placeholder: '请输入用户密码',
    },
]

const rules: Partial<Record<UserInfoKey, FieldRule>> = {
    username: {
        trigger: 'onBlur',
        message: '请输入用户ID',
        validator(value) {
            return !!value.trim()
        },
    },
    password: {
        trigger: 'onBlur',
        message: '请输入用户密码',
        validator(value) {
            return !!value.trim()
        },
    },
}

const login = async () => {
    try {
        await formRef.value?.validate()
        // 登录 获取token
        const login = new LoginBody()
        for (const key in login) {
            if (userInfo[key as UserInfoKey]) {
                login[key as UserInfoKey] = userInfo[key as UserInfoKey]
            }
        }
        const result = await loginUser(login)

        const userStore = useUserStore()
        userStore.setToken(result?.access_token as string)
        userStore.setUserID(result?.user.username as string)
        localStorage.setItem('userToken', result?.access_token as string)
        localStorage.setItem('userId', result?.user.username as string)

        // 连接环信IM
        await EaseChatClient.open({
            user: userInfo.username,
            accessToken: result?.access_token,
        })
        router.replace({
            path: '/main/pages/chat',
        })
    } catch (error) {}
}
</script>

<style scoped lang="scss">
.login {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
