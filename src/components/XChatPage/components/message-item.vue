<script lang="tsx">
import { useUserStore } from '@/stores/user'
import type { MessageData } from '@/types/message'
import { Tools } from '@/utils/tools'
import type { EasemobChat } from 'easemob-websdk'
import type { PropType } from 'vue'
import type { ImgList } from '@/hooks/preview-image'

export default defineComponent({
    props: {
        item: {
            type: Object as PropType<MessageData>,
            required: true,
        },
    } as const,
    emits: ['addImage', 'click'],
    setup(props, { emit, expose }) {
        const userStore = useUserStore()

        const pageData = reactive({})

        const methods = {
            /** 长按事件 */
            longPress() {
                console.log('longpress')
            },
        }

        const content: Partial<Record<EasemobChat.MessageType, JSX.Element>> = {
            txt: (
                <div
                    class="item-wrap"
                    style={{
                        backgroundColor:
                            props.item.from === userStore.userId
                                ? '#a0ea6f'
                                : '#f3f3f3',
                    }}
                >
                    {(props.item as EasemobChat.TextMsgBody).msg}

                    {props.item.from === userStore.userId ? (
                        <div class="sanjiao"></div>
                    ) : (
                        <div class="sanjiao him"></div>
                    )}
                </div>
            ),
            img: (
                <div class="item-wrap image">
                    <img
                        src={(props.item as EasemobChat.ImgMsgBody).url}
                        crossorigin="anonymous"
                        onLoad={() => {
                            emit('addImage', {
                                id: props.item.id,
                                url: (props.item as EasemobChat.ImgMsgBody).url,
                                time: (props.item as EasemobChat.ImgMsgBody)
                                    .time,
                            } as ImgList)
                        }}
                        onClick={() => {
                            emit('click', {
                                id: props.item.id,
                                type: props.item.type,
                            })
                        }}
                    />
                </div>
            ),
            video: (
                <div class="item-wrap video">
                    <video
                        /**
                         * !TODO 视频在手机上播放不了(安卓可以)
                         */
                        src={(props.item as EasemobChat.VideoMsgBody).url}
                        controls
                        crossorigin="anonymous"
                        preload="metadata"
                        onError={(e) => {
                            console.log(props.item)
                        }}
                    />
                </div>
            ),
        }

        return () => (
            <div class="msg-item">
                <div class="msg-item-time">
                    {Tools.showMsgTime(
                        (props.item as EasemobChat.TextMsgBody).time
                    )}
                </div>

                <div
                    class="msg-item-box"
                    style={{
                        flexDirection:
                            props.item.from === userStore.userId
                                ? 'row'
                                : 'row-reverse',
                    }}
                >
                    {content[props.item.type]}

                    <div class="avatar">
                        <img
                            src={Tools.getUrl('avatar-default-man.png')}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        )
    },
})
</script>

<style lang="scss">
.msg-item {
    .msg-item-time {
        text-align: center;
        width: 100rem;
        margin: 5rem auto;
        // background-color: rgba(0, 0, 0, 0.2);
        padding: 5rem 0;
        border-radius: 3rem;
    }
    .msg-item-box {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 10rem;
        .avatar {
            border-radius: 5rem;
            img {
                width: 35rem;
                object-fit: cover;
                border-radius: 5rem;
            }
        }
        .item-wrap {
            margin-top: 5rem;
            position: relative;
            padding: 10rem;
            // background-color: #a0ea6f;
            border-radius: 4rem;
            max-width: 70%;
            .sanjiao {
                width: 0;
                height: 0;
                position: absolute;
                right: 2rem;
                top: 50%;
                transform: translate(100%, -50%);
                border-left: 10rem solid #a0ea6f;
                border-top: 7rem solid transparent;
                border-bottom: 7rem solid transparent;
                border-radius: 5rem;
                &.him {
                    right: 100%;
                    transform: translate(2rem, -50%) rotate(180deg);
                    border-left: 10rem solid #f3f3f3;
                }
            }
            &.image {
                background-color: #f3f3f3;
                img {
                    width: 100%;
                    height: 100%;
                    max-width: 100rem;
                    max-height: 200rem;
                    object-fit: contain;
                }
            }
            &.video {
                video {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>
