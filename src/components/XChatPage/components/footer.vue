<template>
    <div class="footer">
        <div class="top">
            <div class="left">
                <img
                    v-show="pageData.isKeyBoard"
                    :src="Tools.getUrl('voice-black.png')"
                    alt=""
                />
                <img v-show="!pageData.isKeyBoard" src="" alt="" />
            </div>
            <div class="center">
                <textarea
                    v-model="pageData.text"
                    autocomplete="on"
                    wrap="hard"
                    enterkeyhint="send"
                    @keydown="keydown"
                    @focus="
                        emits('toggleFuns', { bool: false, isBehavior: true })
                    "
                />
            </div>
            <div class="right">
                <div class="no-send" v-show="!pageData.text">
                    <img :src="Tools.getUrl('expression-black.png')" alt="" />
                    <img
                        :src="Tools.getUrl('add-black.png')"
                        alt=""
                        @click="
                            emits('toggleFuns', {
                                bool: !props.isSelFuns,
                                isBehavior: true,
                            })
                        "
                    />
                </div>
                <div class="send" v-show="pageData.text" @click="send">
                    发送
                </div>
            </div>
        </div>

        <div
            class="funs"
            :style="{
                height: props.isSelFuns ? 'auto' : 0,
                paddingTop: props.isSelFuns ? '20rem' : 0,
                paddingBottom: props.isSelFuns ? '10rem' : 0,
            }"
        >
            <div
                class="fun"
                v-for="item in funList"
                :key="item.text"
                @click="item.oprate"
            >
                <img :src="item.icon" alt="" />
                {{ item.text }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useChatListStore } from '@/stores/chatList'
import { Tools } from '@/utils/tools'
import { showToast } from 'vant'

interface FunItem {
    text: string
    icon: string
    oprate: () => void
}

interface FooterInstance {
    textControl: (command: 'focus' | 'blur') => void
}

const chatStore = useChatStore()
const chatListStore = useChatListStore()

const textRef = ref<HTMLTextAreaElement>({} as HTMLTextAreaElement)

const props = defineProps<{
    /** 对方的用户id */
    oppositeId: string
    isSelFuns: boolean
}>()
const emits = defineEmits(['scrollBottom', 'toggleFuns'])

const funList: FunItem[] = [
    {
        text: '图片',
        icon: Tools.getUrl('pic.png'),
        oprate() {
            const inp = document.createElement('input')

            inp.type = 'file'
            inp.accept = 'image/*'
            inp.setAttribute('style', 'position:fixed;left:2000px;')
            inp.onchange = function (e) {
                setTimeout(async () => {
                    const { files } = e.target as HTMLInputElement

                    if (files) {
                        console.log('files[0] -->', files[0])
                        const url = URL.createObjectURL(files[0])

                        /** 发送图片必须使用这种格式。否则发送无效 */
                        const file = {
                            data: files[0],
                            filename: files[0].name,
                            filetype: files[0].type,
                        } as unknown as File

                        chatStore.sendMessage(
                            'img',
                            {
                                chatType: 'singleChat',
                                file,
                                to: props.oppositeId,
                            },
                            {
                                chatType: 'singleChat',
                                id: '',
                                url,
                                time: +new Date(),
                                to: props.oppositeId,
                                type: 'img',
                            },
                            () => {
                                emits('toggleFuns', {
                                    bool: false,
                                    isBehavior: true,
                                })
                            }
                        )
                    }

                    document.body.removeChild(inp)
                }, 200)
            }
            document.body.appendChild(inp)
            inp.click()
        },
    },
    {
        text: '视频',
        icon: Tools.getUrl('video.png'),
        oprate() {},
    },
]

const pageData = reactive({
    text: '',
    /** 是否是文本输入 */
    isKeyBoard: true,
})

const keydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        send()
    }
}

const send = () => {
    chatStore.sendMessage(
        'txt',
        {
            chatType: 'singleChat',
            msg: pageData.text,
            to: props.oppositeId,
        },
        {
            chatType: 'singleChat',
            id: '',
            msg: pageData.text,
            time: +new Date(),
            type: 'txt',
            to: props.oppositeId,
        },
        () => {
            pageData.text = ''
        }
    )
    emits('scrollBottom', true)
}

defineExpose({
    textControl: (command) => {
        const controlObj = {
            focus: textRef.value.focus,
            blur: textRef.value.blur,
        }

        controlObj[command]
    },
} as FooterInstance)
</script>

<style scoped lang="scss">
.footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: 10rem;
    background-color: rgba(230, 230, 230, 0.7);
    border-bottom: 1rem solid #ddd;
    img {
        width: 25rem;
        object-fit: contain;
        outline: none;
    }
    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .left,
    .right {
        flex: none;
    }
    .center {
        flex: 1;
        margin: 0 10rem;
        textarea {
            width: 100%;
            margin: 0;
            outline: none;
            border: none;
            resize: none;
            height: 35rem;
            padding: 9.5rem 7rem;
            border-radius: 5rem;
            box-sizing: border-box;
            font-size: 14rem;
        }
    }

    .right {
        display: flex;
        .no-send {
            img {
                outline: none;
                &:first-of-type {
                    margin-right: 10rem;
                }
            }
        }
        .send {
            width: 60rem;
            height: 30rem;
            text-align: center;
            line-height: 30rem;
            letter-spacing: 2rem;
            font-size: 14rem;
            border-radius: 5rem;
            color: #fff;
            background-color: #54c45c;
            transition: background 0.1s ease-in-out;
            &:active {
                background-color: #50b857;
            }
        }
    }
    .funs {
        display: flex;
        align-items: center;
        gap: 15rem;
        overflow: hidden;
        padding-left: 10rem;
        padding-right: 10rem;
        .fun {
            // width: 80rem;
            // height: 80rem;
            padding: 10rem 17rem;
            border-radius: 10rem;
            background-color: #fff;
            text-align: center;
            img {
                width: 25rem;
                display: block;
                margin: 0 auto 3rem;
            }
        }
    }
}
</style>
