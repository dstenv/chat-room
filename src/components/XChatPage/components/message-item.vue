<script lang="tsx">
import type { MessageData } from '@/types/message'
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
        return () => {}
    },
})
</script>

<style scoped></style>
