<template>
    <div
        class="box"
        :style="{
            borderBottom: props.border ? '1px solid #ebebeb' : '',
        }"
    >
        <p>{{ props.text }}</p>

        <div v-if="props.render" class="custom">
            <component :is="props.render()" />
        </div>

        <img :src="Tools.getUrl('back.png')" alt="" />
    </div>
</template>

<script setup lang="ts">
import { Tools } from '@/utils/tools'

export interface OtherInfoItemType {
    text: string
    border?: boolean
    render?: () => JSX.Element
}

const props = defineProps<OtherInfoItemType>()
</script>

<style scoped lang="scss">
.box {
    display: flex;
    align-items: center;
    padding: 15rem 0;
    margin: 0 15rem;
    justify-content: space-between;
    p {
        font-size: 16rem;
        font-weight: 500;
    }
    img {
        width: 15rem;
        transform: rotate(180deg);
    }
    .custom {
        flex: 1;
        justify-self: flex-start;
        padding-left: 15rem;
        font-size: 14rem;
        color: #727272;
    }
}
</style>
