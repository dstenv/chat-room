<template>
    <div
        class="register"
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
                <div class="btn" @click="register">注册</div>
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { registerUser } from '@/apis/registerUser'
import { Tools } from '@/utils/tools'
import type { RuleItem } from './login.vue'
import { isUserId } from '@/utils/validate'
import { showToast } from 'vant'
import { setUsetInfo } from '@/apis/user/setUsetInfo'

type UserInfoKey = 'userID' | 'password' | 'nickName'

interface FormItem {
    name: string
    label: string
    placeholder: string
    key: UserInfoKey
    maxlength?: number
    type: 'password' | 'number' | 'text'
}

const emits = defineEmits(['goLogin'])

const bg = Tools.getUrl('register-bg.png', 'imgs')

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
        placeholder: '请输入6-10位用户ID',
        maxlength: 10,
        type: 'number',
    },
    {
        key: 'nickName',
        label: '昵称',
        name: '昵称',
        placeholder: '请输入用户昵称',
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
    userID: {
        message: '请输入有效的用户ID',
        validator(value) {
            isUserId.lastIndex = 0
            return !isUserId.test(value as string)
        },
    },
    password: {
        message: '请输入用户密码',
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

const register = async () => {
    try {
        if (!validate()) {
            return
        }
        // console.log('注册')
        // 注册
        await registerUser({
            nickname: userInfo.nickName,
            username: userInfo.userID,
            password: userInfo.password,
        })
        /** 设置用户信息 */
        await setUsetInfo(userInfo.userID)({
            nickname: userInfo.nickName,
            sex: '1',
            title: 'test',
        })

        showToast('注册成功')

        emits('goLogin')
    } catch (error) {
        showToast('注册失败')
    }
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

.register {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-size: cover;
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
            font-size: 12rem;
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
