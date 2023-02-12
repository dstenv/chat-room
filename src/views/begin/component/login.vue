<template>
    <div style="width: 100vw; height: 100vh">
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
import { loginUser } from '@/apis/loginUser'
import { useUserStore } from '@/stores/user'
import { EaseChatClient } from '@/utils/config'

const router = useRouter()

type UserInfoKey = 'userID' | 'password'

interface FormItem {
    name: string
    label: string
    placeholder: string
    key: UserInfoKey
    maxlength?: number
}

const formRef = ref<FormInstance>({} as FormInstance)

const userInfo = reactive({
    userID: '',
    password: '',
})

const formList: FormItem[] = [
    {
        key: 'userID',
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
    userID: {
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
        const result = await loginUser({
            username: userInfo.userID,
            password: userInfo.password,
        })
        const userStore = useUserStore()
        userStore.setToken(result?.access_token as string)
        userStore.setUserID(result?.user.username as string)
        localStorage.setItem('userToken', result?.access_token as string)
        localStorage.setItem('userId', result?.user.username as string)
        await EaseChatClient.open({
            user: userInfo.userID,
            accessToken: result?.access_token,
        })
        router.replace({
            path: '/main/pages/chat',
        })
    } catch (error) {}
}
</script>

<style scoped></style>
