<template>
    <div class="user">
        <div class="content">
            <div class="header">
                <img
                    :src="Tools.getUrl('back.png')"
                    alt=""
                    @click="() => router.back()"
                />
                <img
                    :src="Tools.getUrl('many.png')"
                    alt=""
                    @click="
                        () => {
                            props.rightClick && props.rightClick()
                        }
                    "
                />
            </div>

            <main>
                <section>
                    <div class="avatar">
                        <img
                            :src="props.userInfo.avatar || defaultData.avatar"
                            alt=""
                        />
                    </div>
                    <div class="info">
                        <p>
                            {{
                                props.userInfo.nickname ||
                                props.userInfo.userid ||
                                '-'
                            }}
                        </p>
                        <span>{{
                            props.userInfo.area ||
                            `${defaultData.area.city} ${defaultData.area.country}`
                        }}</span>
                    </div>
                </section>

                <div style="background-color: #fff">
                    <i class="slide" />

                    <XOprateItem text="备注和标签" />
                </div>

                <div class="other">
                    <XOprateItem
                        v-for="item in props.otherInfoList"
                        :key="item.text"
                        :text="item.text"
                        :border="item.border"
                        :render="item.render"
                    />
                </div>

                <slot name="oprate">
                    <div class="add" @click="methods.showPopup">
                        添加到通讯录
                    </div>
                </slot>
            </main>
        </div>

        <VanPopup position="bottom" :show="showAddPopup" :overlay="false">
            <div class="add-box">
                <div class="add-head">
                    <div style="width: 20rem; height: 20rem" />
                    <p>申请添加朋友</p>
                    <img
                        :src="Tools.getUrl('close-gray.png')"
                        alt=""
                        @click="() => (showAddPopup = false)"
                    />
                </div>

                <div class="add-content">
                    <div class="send-item">
                        <div class="send-tip">发送添加朋友申请</div>
                        <textarea v-model="addData.sendText" />
                    </div>
                </div>

                <div class="send-btn" @click="methods.sendAddMsg">发送</div>
            </div>
        </VanPopup>
    </div>
</template>

<script setup lang="tsx">
import type { UserProPertyType } from '@/types'
import { Tools } from '@/utils/tools'
import XOprateItem from '@/components/XOprateItem/index.vue'
import type { OtherInfoItemType } from '@/components/XOprateItem/index.vue'
import { EaseChatClient } from '@/utils/config'
import { showSuccessToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()

const props = defineProps<{
    userInfo: UserProPertyType
    otherInfoList: OtherInfoItemType[]
    rightClick?: () => void
}>()

const defaultData = reactive({
    avatar: Tools.getDefaultAvatar(Number(props.userInfo.sex || '1') !== 1, ''),
    /**
     * TODO 这里可以使用地图api获取当前定位的城市作为默认地址显示
     */
    area: {
        country: '中国',
        city: '广东',
    } as Record<string, any>,
})

const showAddPopup = ref(false)

const addData = reactive({
    sendText: '',
})

const methods = {
    showPopup() {
        showAddPopup.value = true
    },

    sendAddMsg() {
        console.log(props.userInfo.userid, 'props.userInfo.userid')
        const userStore = useUserStore()
        EaseChatClient.addContact(
            props.userInfo.userid as string,
            JSON.stringify({
                text: addData.sendText,
                avatar:
                    userStore.userInfo?.avatar ||
                    Tools.getUrl(
                        userStore.userInfo?.sex === '2'
                            ? 'avatar-default-uwoman.png.png'
                            : 'avatar-default-uman.png.png'
                    ),
                nickname: userStore.userInfo?.nickname,
            })
        )

        showAddPopup.value = false

        showSuccessToast({
            message: '发送成功',
        })

        setTimeout(() => {
            router.go(-2)
        }, 400)
    },
}
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}
.user {
    height: 100vh;
    background-color: #ededed;
    .content {
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15rem;
            background-color: #fff;
            img {
                width: 25rem;
            }
        }
    }
    main {
        section {
            display: flex;
            padding: 15rem 20rem 25rem;
            background-color: #fff;
            .avatar {
                // border-radius: 7rem;
                img {
                    width: 70rem;
                    display: block;
                    // border-radius: 7rem;
                }
            }
            .info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                padding: 10rem 0 10rem 15rem;
                p {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 18rem;
                    font-weight: bold;
                }
                span {
                    font-size: 14rem;
                    color: #727272;
                    font-weight: 500;
                }
            }
        }
        .slide {
            display: block;
            width: calc(100vw - 40rem);
            height: 1px;
            margin: 0 auto;
            transform: scaleY(0.5);
            background-color: #ddd;
        }
        .other {
            margin-top: 10rem;
            background-color: #fff;
        }
        .add {
            background-color: #fff;
            font-size: 17rem;
            color: #5f6891;
            font-weight: bold;
            letter-spacing: 1rem;
            margin-top: 10rem;
            padding: 18rem 0;
            text-align: center;
        }
    }

    .add-box {
        height: 100vh;
        position: relative;
        overflow-y: scroll;
    }

    .add-head {
        display: flex;
        padding: 15rem;
        align-items: center;
        justify-content: space-between;
        p {
            font-size: 16rem;
            font-weight: bold;
            letter-spacing: 1rem;
        }
        img {
            width: 20rem;
        }
    }
    .add-content {
        padding: 15rem 30rem;
        .send-item {
            .send-tip {
                padding-left: 10rem;
                padding-bottom: 7rem;
                font-size: 13rem;
                color: #333333;
            }
            textarea {
                border: none;
                outline: none;
                resize: none;
                background-color: #eeeeee;
                width: 100%;
                height: 70rem;
                border-radius: 5rem;
                box-sizing: border-box;
                padding: 15rem 15rem 0 15rem;
                font-size: 14rem;
            }
        }
    }
    .send-btn {
        position: absolute;
        bottom: 20rem;
        left: 0;
        right: 0;
        width: 170rem;
        margin: 0 auto;
        text-align: center;
        background-color: #59ce61;
        padding: 15rem 0;
        border-radius: 10rem;
        color: #fff;
        font-size: 15rem;
        font-weight: 400;
        // padding: 20rem 100rem;
    }
}
</style>
