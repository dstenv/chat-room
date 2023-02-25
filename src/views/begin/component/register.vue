<template>
    <div style="width: 100vw; height: 100vh">
        <van-form @submit="register" ref="formRef">
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
                    注册
                </van-button>
                <slot />
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import type { FieldRule, FormInstance } from 'vant'
import { registerUser } from '@/apis/registerUser'

type UserInfoKey = 'userID' | 'password' | 'nickName'

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
    nickName: '',
})

const formList: FormItem[] = [
    {
        key: 'userID',
        label: '用户ID',
        name: '用户ID',
        placeholder: '请输入用户ID',
    },
    {
        key: 'nickName',
        label: '昵称',
        name: '昵称',
        placeholder: '请输入用户昵称',
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

const register = async () => {
    try {
        await formRef.value?.validate()
        // 注册
        await registerUser({
            nickname: userInfo.nickName,
            username: userInfo.userID,
            password: userInfo.password,
        })
    } catch (error) {}
}
</script>

<style scoped></style>
