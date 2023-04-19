<template>
    <div class="publish">
        <div class="head">
            <span @click="emits('hide')">取消</span>
            <span class="publish-btn" @click="publish">发表</span>
        </div>

        <main>
            <div class="top">
                <div class="text-box">
                    <textarea
                        placeholder="这一刻的想法..."
                        v-model="pageData.text"
                    />
                </div>
                <div class="img-box" v-if="props.type === 'img'">
                    <img
                        v-for="item in imgList"
                        :key="item.id"
                        :src="item.url"
                        alt=""
                        @click="preview(item.id)"
                    />

                    <div class="add-img" @click="selectImg">
                        <i />
                        <i />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { FileLimit } from '@/utils/config'
import type { PublishType } from '../index.vue'
import { showToast } from 'vant'
import { usePreviewImage } from '@/hooks/preview-image'
import { useChatStore } from '@/stores/chat'
import { useChatListStore } from '@/stores/chatList'

const props = defineProps<{
    type: PublishType
}>()

const emits = defineEmits(['hide'])
const chatStore = useChatStore()
const chatListStore = useChatListStore()

const pageData = reactive({
    text: '',
})

const { imgList, addImg, preview } = usePreviewImage()

const publish = () => {
    chatStore.setchatData(chatListStore.momentGroup.groupid, 'groupChat')
    chatStore.sendMessage(
        'custom',
        {
            chatType: 'groupChat',
            to: chatListStore.momentGroup.groupid,
            customExts: {
                files: imgList.value.map((item) => item.file as File),
                text: pageData.text,
                type: props.type,
            },
            ext: {},
        },
        {
            chatType: 'groupChat',
            customEvent: '',
            customExts: {
                files: imgList.value.map((item) => item.file as File),
                text: pageData.text,
                type: props.type,
            },
            id: '',
            time: +new Date(),
            to: chatListStore.momentGroup.groupid,
            type: 'custom',
        },
        () => {
            pageData.text = ''
            emits('hide')
        }
    )
}

const selectImg = () => {
    if (imgList.value.length >= 9) {
        showToast('最多添加9张图片')
        return
    }

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

                const url = URL.createObjectURL(files[0])

                const reader = new FileReader()

                reader.onload = () => {
                    addImg({
                        id: `${Date.now().toString(36).slice(0, 8)}`,
                        time: +new Date(),
                        url,
                        file: reader.result as string,
                    })
                }
                reader.readAsDataURL(files[0])
            }

            document.body.removeChild(inp)
        }, 100)
    }
    document.body.appendChild(inp)
    inp.click()
}
</script>

<style scoped lang="scss">
.publish {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    padding: 10rem 20rem;
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10rem;
        border-bottom: 1rem solid #eee;
        span {
            font-size: 14rem;
        }
        .publish-btn {
            padding: 8rem 12rem;
            background-color: #59ce61;
            color: #fff;
            border-radius: 5rem;
        }
    }
}
main {
    .top {
    }
    .text-box {
        textarea {
            width: 100%;
            border: none;
            outline: none;
            resize: none;
            height: 150rem;
            font-size: 15rem;
            box-sizing: border-box;
            padding: 10rem;
        }
    }
    .img-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10rem;
        flex-wrap: wrap;
        img {
            width: calc((100vw - 70rem) / 4);
            height: calc((100vw - 70rem) / 4);
            object-fit: cover;
            border-radius: 8rem;
        }
        .add-img {
            width: calc((100vw - 70rem) / 4);
            height: calc((100vw - 70rem) / 4);
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
    }
}
</style>
