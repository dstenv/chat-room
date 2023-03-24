<script lang="tsx">
import type { MessageData } from '@/types/message'
import tools from '@/utils/tools'
import type { EasemobChat } from 'easemob-websdk'
import type { PropType } from 'vue'

export default defineComponent({
    props: {
        item: {
            type: Object as PropType<MessageData>,
            required: true,
        },
    } as const,
    emits: [],
    setup(props, { emit, expose }) {
        const getUrl = tools.getUrl

        const pageData = reactive({})

        const methods = {
            /** 长按事件 */
            longPress() {},
        }

        const content: Partial<Record<EasemobChat.MessageType, JSX.Element>> = {
            txt: (
                <div class="item-wrap">
                    {(props.item as EasemobChat.TextMsgBody).msg}
                    <div class="sanjiao"></div>
                </div>
            ),
            img: (
                <div class="item-wrap image">
                    <img src={(props.item as EasemobChat.ImgMsgBody).url} />
                </div>
            ),
        }

        return () => (
            <div class="msg-item">
                {content[props.item.type]}

                <div class="avatar">
                    <img src={getUrl('avatar-default-man.png')} alt="" />
                </div>
            </div>
        )
    },
})
</script>

<style lang="scss">
.msg-item {
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
        background-color: #a0ea6f;
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
        }
        &.image {
            background-color: #f3f3f3;
        }
    }
}
</style>
