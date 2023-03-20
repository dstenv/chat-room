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

        if (props.item.type === 'txt') {
            return () => (
                <div class="msg-item">
                    <div class="item-wrap">
                        {(props.item as EasemobChat.TextMsgBody).msg}
                        <div class="sanjiao"></div>
                    </div>
                    <div class="avatar">
                        <img src={getUrl('avatar-default-man.png')} alt="" />
                    </div>
                </div>
            )
        }
        return () => {}
    },
})
</script>

<style scoped lang="scss">
.msg-item {
    display: flex;
    align-items: center;
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
    }
}
</style>
