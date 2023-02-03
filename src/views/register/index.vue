<template>
    <div>
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
                    :rules="[rules[item.key]]"
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
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import type { FieldRule, FormInstance } from 'vant'

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
        placeholder: '用户ID',
    },
    {
        key: 'password',
        label: '密码',
        name: '密码',
        placeholder: '密码',
    },
]

const rules: Record<UserInfoKey, FieldRule> = {
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
    } catch (error) {}
}
</script>

<style scoped></style>
