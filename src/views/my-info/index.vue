<template>
    <div class="my-info c-bg">
        <XHeader
            title="个人信息"
            :left-icon="Tools.getUrl('back.png')"
            :leftClick="
                () => {
                    router.back()
                }
            "
        />

        <div class="box">
            <div
                class="item avatar"
                @click="
                    () => {
                        // pageData.showEdit = false
                        // pageData.editAvatar = true
                    }
                "
            >
                <div class="left">头像</div>
                <div class="right">
                    <img
                        :src="
                            Tools.getDefaultAvatar(
                                userStore.userInfo?.sex === '2',
                                userStore.userInfo?.avatar
                            )
                        "
                        alt=""
                    />
                    <img :src="Tools.getUrl('back.png')" alt="" class="back" />
                </div>
            </div>

            <div
                class="item"
                v-for="item in oprateList"
                :key="item.key"
                @click="oprateClick(item.key, item.text)"
            >
                <div class="left">{{ item.text }}</div>
                <div class="right">
                    <div>{{ pageData.edit![item.key] }}</div>
                    <img :src="Tools.getUrl('back.png')" alt="" class="back" />
                </div>
            </div>
        </div>

        <VanPopup position="bottom" :show="pageData.showEdit" :overlay="false">
            <div class="my-edit c-bg">
                <div class="edit-head">
                    <div
                        class="edit-cancel"
                        @click="() => (pageData.showEdit = false)"
                    >
                        取消
                    </div>
                    <div>设置{{ pageData.editText }}</div>
                    <div class="edit-finish" @click="editFinsh">完成</div>
                </div>

                <div class="input">
                    <input
                        type="text"
                        v-model="pageData.edit[pageData.editKey]"
                    />
                </div>
            </div>
        </VanPopup>

        <!-- <VanPopup
            position="bottom"
            :overlay="false"
            :show="pageData.editAvatar"
        >
            <div class="edit-avatar c-bg">
                <div class="edit-head">
                    <div
                        class="edit-cancel"
                        @click="() => (pageData.editAvatar = false)"
                    >
                        取消
                    </div>
                    <div>设置头像</div>
                    <div class="edit-finish" @click="uploadAvatar">完成</div>
                </div>

                <div class="upload">
                    <div class="img" v-if="pageData.tempImg">
                        <img :src="pageData.tempImg" alt="" />
                    </div>
                    <div class="add-img" @click="selectImg">
                        <i />
                        <i />
                    </div>
                </div>
            </div>
        </VanPopup> -->
    </div>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/apis/user/getUserInfo'
import { setUsetInfo } from '@/apis/user/setUsetInfo'
import { useUserStore } from '@/stores/user'
import type { UserProPertyType } from '@/types'
import { Tools } from '@/utils/tools'
import XHeader from '@/components/XHeader/index.vue'
import { showSuccessToast, showToast } from 'vant'
import { FileLimit } from '@/utils/config'

type MyInfoKey = keyof UserProPertyType

interface OprateItem {
    text: string
    key: MyInfoKey
}

const userStore = useUserStore()
const router = useRouter()

const pageData = reactive({
    showEdit: false,
    editText: '',
    edit: {} as UserProPertyType,
    editKey: 'nickname' as MyInfoKey,
    editAvatar: false,
    tempImg: '',
})

const oprateList: OprateItem[] = [
    {
        text: '昵称',
        key: 'nickname',
    },
    {
        text: '个性签名',
        key: 'sign',
    },
    {
        text: '邮箱',
        key: 'mail',
    },
    {
        text: '手机号',
        key: 'phone',
    },
]

const oprateClick = (key: MyInfoKey, text: string) => {
    console.log('key -->', key)

    pageData.editKey = key
    pageData.editText = text

    pageData.editAvatar = false
    pageData.showEdit = true
}

const init = async () => {
    try {
        const result = await getUserInfo(userStore.userId)()
        pageData.edit = {
            ...userStore.userInfo,
            ...result.data,
        }
    } catch (error) {}
}

const editFinsh = async () => {
    try {
        await setUsetInfo(userStore.userId)({
            [pageData.editKey]: pageData.edit[pageData.editKey],
        })
    } catch (error) {
    } finally {
        showSuccessToast({
            message: '设置成功',
            duration: 100,
        })
        setTimeout(() => {
            pageData.showEdit = false
        }, 100)
    }
}

const selectImg = () => {
    const inp = document.createElement('input')

    inp.type = 'file'
    inp.accept = 'image/*'
    inp.setAttribute('style', 'position:fixed;left:2000px;')
    inp.onchange = (e) => {
        setTimeout(() => {
            console.log('e.target -->', e)
            const { files } = e.target as HTMLInputElement

            if (files) {
                if (files[0].size / 1024 / 1024 > FileLimit.imgSize) {
                    showToast(`图片大小最大不超过${FileLimit.imgSize}M`)
                    return
                }

                const reader = new FileReader()

                reader.onload = () => {
                    pageData.tempImg = reader.result as string
                }

                reader.readAsDataURL(files[0])
            }

            document.body.removeChild(inp)
        }, 100)
    }
    document.body.appendChild(inp)
    inp.click()
}

const uploadAvatar = async () => {
    try {
        await setUsetInfo(userStore.userId)({
            avatarurl: pageData.tempImg,
        })
    } catch (error) {
    } finally {
        showSuccessToast({
            message: '设置成功',
            duration: 100,
        })
        setTimeout(() => {
            pageData.editAvatar = false
        }, 100)
    }
}

init()
</script>

<style scoped lang="scss">
::-webkit-input-placeholder {
    font-size: 14rem;
}
.my-info {
    height: 100vh;
    .box {
        background-color: #fff;
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15rem;
            border-bottom: 1rem solid #ddd;
            .left {
                font-size: 15rem;
            }
            .right {
                display: flex;
                align-items: center;
                font-size: 15rem;
                img {
                    flex: none;
                    display: block;
                    width: 60rem;
                    &.back {
                        margin-left: 5rem;
                        width: 20rem;
                        transform: rotate(180deg);
                    }
                }
            }
            &.avatar {
                padding-top: 30rem;
            }
        }
    }
    .my-edit {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        .edit-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15rem;
            font-size: 14rem;
            .edit-cancel {
                width: 48rem;
            }
            .edit-finish {
                padding: 8rem 10rem;
                background-color: #59ce61;
                border-radius: 5rem;
                color: #fff;
            }
        }
        .input {
            background-color: #fff;
            font-size: 14rem;
            input {
                border: none;
                outline: none;
                width: 100%;
                padding: 10rem;
            }
        }
    }
}

.edit-avatar {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .edit-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15rem;
        font-size: 14rem;
        .edit-cancel {
            width: 48rem;
        }
        .edit-finish {
            padding: 8rem 10rem;
            background-color: #59ce61;
            border-radius: 5rem;
            color: #fff;
        }
    }
    .upload {
        display: flex;
        align-items: center;
        .add-img {
            width: calc((100vw - 70rem) / 3);
            height: calc((100vw - 70rem) / 3);
            background-color: #f7f7f7;
            position: relative;
            overflow: hidden;
            border-radius: 7rem;
            i {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                display: block;
                width: 30rem;
                height: 1.2rem;
                background-color: rgb(0, 0, 0);
                &:first-of-type {
                    transform: rotate(90deg);
                }
            }
        }
        .img {
            img {
                width: calc((100vw - 70rem) / 3);
                height: calc((100vw - 70rem) / 3);
                object-fit: cover;
            }
        }
    }
}
</style>
