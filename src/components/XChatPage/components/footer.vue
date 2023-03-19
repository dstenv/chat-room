<template>
    <div class="footer">
        <div class="left">
            <img
                v-show="pageData.isKeyBoard"
                :src="tools.getUrl('voice-black.png')"
                alt=""
            />
            <img v-show="!pageData.isKeyBoard" src="" alt="" />
        </div>
        <div class="center">
            <textarea v-model="pageData.text" autocomplete="on" wrap="hard" />
        </div>
        <div class="right">
            <div class="no-send" v-show="!pageData.text">
                <img :src="tools.getUrl('expression-black.png')" alt="" />
                <img :src="tools.getUrl('add-black.png')" alt="" />
            </div>
            <div class="send" v-show="pageData.text" @click="send">发送</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import tools from '@/utils/tools'
import { showToast } from 'vant'

const chatStore = useChatStore()

const props = defineProps<{
    /** 对方的用户id */
    oppositeId: string
}>()
const emits = defineEmits([])

const pageData = reactive({
    text: '',
    /** 是否是文本输入 */
    isKeyBoard: true,
})

const send = async () => {
    try {
        await chatStore.sendMessage(
            'txt',
            {
                chatType: 'singleChat',
                msg: pageData.text,
                to: props.oppositeId,
                ext: 'test',
            },
            {
                chatType: 'singleChat',
                id: '',
                msg: pageData.text,
                time: +new Date(),
                type: 'txt',
                to: props.oppositeId,
            }
        )
        pageData.text = ''
    } catch (error) {
        showToast('发送失败')
    }
}
</script>

<style scoped lang="scss">
.footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rem;
    background-color: rgba(230, 230, 230, 0.7);
    img {
        width: 25rem;
        object-fit: contain;
        outline: none;
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
}
</style>
