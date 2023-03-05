<template>
    <div class="xheader c-bg">
        <div class="left">
            <img v-if="props.leftIcon" :src="props.leftIcon" alt="" />
        </div>
        <div class="mid">
            {{ props.title }}
        </div>
        <div class="right">
            <slot name="right" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
    centerIcon?: string
    leftIcon?: string
}>()
</script>

<style scoped lang="scss">
.xheader {
    display: flex;
    align-items: center;
    padding: 10rem 20rem;
    justify-content: space-between;
    position: relative;
    .left,
    .right {
        width: 22rem;
        height: 22rem;
        img {
            width: 100%;
        }
    }
    .mid {
        font-size: 16rem;
        font-weight: 500;
    }
}
</style>
