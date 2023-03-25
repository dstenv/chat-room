<template>
    <div class="xheader">
        <div class="header-box c-bg">
            <div
                class="left"
                @click="
                    () => {
                        props.leftClick && props.leftClick()
                    }
                "
            >
                <img v-if="props.leftIcon" :src="props.leftIcon" alt="" />
            </div>
            <div class="mid">
                {{ props.title }}
            </div>
            <div class="right">
                <slot name="right" />
            </div>
        </div>
        <slot name="custom" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
    centerIcon?: string
    leftIcon?: string
    leftClick?: () => void
}>()
</script>

<style scoped lang="scss">
.xheader {
}
.header-box {
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
        :slotted(img) {
            width: 100%;
        }
    }
    .mid {
        font-size: 16rem;
        font-weight: 500;
    }
}
</style>
