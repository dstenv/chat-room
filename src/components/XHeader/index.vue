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
                <div class="mid-content text-over">{{ props.title }}</div>
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
        position: relative;
        z-index: 2;
        height: 22rem;
        img {
            width: 22rem;
        }
        :slotted(img) {
            width: 22rem;
        }
    }
    .right {
        min-width: 22rem;
        line-height: 22rem;
    }
    .mid {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        .mid-content {
            font-size: 16rem;
            font-weight: 500;
            max-width: 200rem;
        }
    }
}
</style>
